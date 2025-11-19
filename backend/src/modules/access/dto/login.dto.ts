import { IsEmail, IsString, MinLength, IsIn, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsString({ message: 'El tipo de usuario debe ser una cadena de texto' })
  @IsIn(['CLIENTE', 'TRABAJADOR'], {
    message: 'El tipo de usuario debe ser CLIENTE o TRABAJADOR',
  })
  @IsOptional()
  userType?: string;
}
