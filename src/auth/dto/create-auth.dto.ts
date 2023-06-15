import {IsEmail, IsNotEmpty, IsString, Matches, MinLength} from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    mobile: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*[\W_])(?=.*[a-z]).{8,}$/, {
        message: 'Mật khẩu phải có ít nhất 8 ký tự, 1 ký tự viết hoa và 2 ký tự đặc biệt.',
    })
    password: string;
}
