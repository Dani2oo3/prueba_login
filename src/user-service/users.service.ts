import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChangePasswordDto, UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as Filter from 'bad-words';

type Tokens = {
  access_token: string,
  refresh_token: string
};

@Injectable()
export class UsersService {
  private filter: Filter;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtSvc: JwtService) {
    this.filter = new Filter();
  }

  async register(createUserDto: UserDto, email: string): Promise<User> {
    const isEmailExist = await this.userModel.findOne({ email });
  
    if (isEmailExist) {
      throw new BadRequestException('User already exists with this email!');
    }
  
    // Normalizar el nombre de usuario (sin espacios y en minúsculas)
    const normalizedUsername = this.normalizeUsername(createUserDto.name);
  
    // Reemplazar números por letras correspondientes
    const usernameWithLetters = this.replaceNumbersWithLetters(normalizedUsername);
  
    // Validar nombre de usuario
    this.validateUsername(usernameWithLetters);
  
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
      const newUser = new this.userModel({
        ...createUserDto,
        name: usernameWithLetters, // Asignar el nombre normalizado y sin números
        password: hashedPassword
      });
  
      return await newUser.save();
  
    } catch (error) {
      throw new HttpException('Please check your credentials', HttpStatus.UNAUTHORIZED);
    }
  }
  
  private normalizeUsername(username: string): string {
    // Eliminar espacios y convertir a minúsculas
    return username.replace(/\s/g, '').toLowerCase();
  }
  
  private replaceNumbersWithLetters(username: string): string {
    // Mapear números a letras correspondientes
    const numberToLetterMap = {
      '0': 'o',
      '1': 'l',
      '3': 'e',
      '4': 'a',
      '5': 's',
      '6': 'g',
      '7': 't',
      '8': 'b',
      '9': 'g'
    };
  
    // Reemplazar cada número por su letra correspondiente
    return username.replace(/[0-9]/g, match => numberToLetterMap[match]);
  }
  
  private validateUsername(username: string): void {
    // Verificar con bad-words
    if (this.filter.isProfane(username)) {
      throw new BadRequestException('El nombre de usuario contiene palabras ofensivas.');
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
