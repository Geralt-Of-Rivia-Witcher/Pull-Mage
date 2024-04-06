import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  gitHubUsername: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
