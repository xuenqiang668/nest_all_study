import { Contains, IsFQDN, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @Length(10, 20)
  title: string;

  @Contains('hello')
  text: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsFQDN()
  site: string;
}
