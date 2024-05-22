import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto, UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() createUserDto: UserDto) {
    const { email, password } = createUserDto;
    return this.usersService.loginUser(email, password);
  }
  
  @Get('getUsers')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.usersService.changePassword(changePasswordDto);
  }

  //eliminar por id
  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.usersService.deleteUser(userId);
  }

  //encontrar por email
  @Get(':email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.getUserByEmail(email);
  }
}
