import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  gitHubUsername: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
