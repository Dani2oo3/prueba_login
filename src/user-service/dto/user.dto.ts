import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'El nombre del usuario' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'El correo electrónico del usuario', uniqueItems: true })
  @IsEmail()
  @IsNotEmpty()
  @Prop({ unique: true })
  readonly email: string;

  @ApiProperty({ description: 'La contraseña del usuario' })
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'El número de teléfono del usuario' })
  @IsString()
  readonly phone: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'El ID del usuario' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'La nueva contraseña del usuario' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
