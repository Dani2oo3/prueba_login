import { Prop } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString, MinLength, } from 'class-validator';

export class UserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  @Prop({unique: true })
  readonly email: string;

  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  readonly phone: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  userId: string; // Identificador del usuario

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}

