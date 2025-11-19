import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(1, { message: 'El nombre es requerido' })
  nombre!: string;

  @IsString({ message: 'El apellido paterno debe ser una cadena de texto' })
  @MinLength(1, { message: 'El apellido paterno es requerido' })
  apePaterno!: string;

  @IsString({ message: 'El apellido materno debe ser una cadena de texto' })
  @IsOptional()
  apeMaterno?: string;

  @IsEmail({}, { message: 'El email debe ser válido' })
  correo!: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsOptional()
  telefono?: string;
}
