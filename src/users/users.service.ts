import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChangePasswordDto, UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
type Tokens = {
  access_token: string,
  refresh_token: string
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtSvc: JwtService) { }

  async create(createUserDto: UserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword
      });

      return await newUser.save();

    } catch (error) {

      throw new HttpException('Please check your credentials', HttpStatus.UNAUTHORIZED);

    }
  }


  async loginUser(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email });
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new HttpException('Please check your credentials', HttpStatus.UNAUTHORIZED);
      }

      if (user && isPasswordValid) {
        const payload = { sub: user._id, email: user.email, name: user.name }

        return {
          access_token: await this.jwtSvc.signAsync(payload, {
            secret: 'jwt secret',
            expiresIn: '1d'
          }),
          refresh_token: await this.jwtSvc.signAsync(payload, {
            secret: 'jwt secret_refresh',
            expiresIn: '7d'
          }),

          message: 'Login Successful'
        };
      }

    } catch (error) {
      throw new HttpException('Please check your credentials', HttpStatus.UNAUTHORIZED);
    }

  }

  async refreshToken(refreshToken: string) {

    try {

      const user = this.jwtSvc.verify(refreshToken, { secret: 'jwt_secret_refresh' });
      const payload = { sub: user._id, email: user.email, name: user.name };
      const { access_token, refresh_token } = await this.generateTokens(payload);
      return {
        access_token, refresh_token,
        status: 200,
        message: 'Refresh token successfully'
      };
    } catch (error) {
      throw new HttpException('Refresh token failed', HttpStatus.UNAUTHORIZED)
    }
  }

  private async generateTokens(user): Promise<Tokens> {
    const jwtPayload = { sub: user._id, email: user.email, name: user.name }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtSvc.signAsync(jwtPayload, {
        secret: 'jwt_secret',
        expiresIn: '1d',
      }),
      this.jwtSvc.signAsync(jwtPayload, {
        secret: 'jwt_secret_refresh',
        expiresIn: '7d',
      }),
    ])
    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<User> {
    const { userId, newPassword } = changePasswordDto;

    // Encuentra al usuario por ID
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Encripta la nueva contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Guarda el usuario actualizado con la nueva contraseña encriptada
    await user.save();

    return user;  // Devuelve el usuario actualizado
  }

  async deleteUser(userId: string): Promise<void> {
    // Utiliza `findByIdAndDelete` para eliminar el usuario por ID
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      // Si el usuario no se encuentra, lanza una excepción
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Si el usuario no se encuentra, lanza una excepción
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user; // Devuelve el usuario encontrado
  }
}
