import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto, UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'register' })
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'El usuario ha sido creado.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createUserDto: UserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern({ cmd: 'login' })
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas.' })
  login(@Body() createUserDto: UserDto) {
    const { email, password } = createUserDto;
    return this.usersService.loginUser(email, password);
  }

  @MessagePattern({ cmd: 'getUsers' })
  @Get('getUsers')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.', type: [User] })
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @MessagePattern({ cmd: 'change-password' })
  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.usersService.changePassword(changePasswordDto);
  }

  @MessagePattern({ cmd: 'delete:id' })
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.usersService.deleteUser(userId);
  }

  @MessagePattern({ cmd: 'get:email' })
  @Get(':email')
  @ApiOperation({ summary: 'Obtener usuario por correo electrónico' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.getUserByEmail(email);
  }
}
