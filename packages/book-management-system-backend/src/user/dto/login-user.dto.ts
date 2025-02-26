import { IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty({ message: "username is not empty" })
    username: string;

    @IsNotEmpty({ message: "password is not empty" })
    @MinLength(6, { message: "password must be at least 6 characters long" })
    password: string;
}
