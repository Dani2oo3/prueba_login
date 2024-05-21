import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
    return await this.usersService.getAllUsers(); // Llama al servicio para obtener todos los usuarios
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
  //encontrar por id o email
  @Get(':id')
  async getUserById(@Param('id') userId: string): Promise<User> {
    return await this.usersService.getUserById(userId);
  }

  //enviar correo con cambio de contraseña

}
