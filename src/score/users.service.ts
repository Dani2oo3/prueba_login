import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: UserDto): Promise<User> {
    try {
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new HttpException('Please check your credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  async getAllScores(): Promise<{ name: string, puntuacion: number }[]> {
    try {
      const users = await this.userModel.find()
        .select('name puntuacion -_id')
        .sort({ puntuacion: -1 }) // Ordenar de mayor a menor
        .limit(10) // Limitar a los 10 primeros usuarios
        .exec();
  
      const scores = users.map(user => ({ name: user.name, puntuacion: user.puntuacion }));
      return scores;
    } catch (error) {
      console.error('Error retrieving scores:', error.message);
      throw new HttpException('Could not retrieve scores', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
