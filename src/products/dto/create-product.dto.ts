import {IsEmail, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    title : string

    @IsNotEmpty()
    @IsString()
    slug : string

    @IsNotEmpty()
    @IsString()
    category : string

    @IsNotEmpty()
    @IsString()
    brand : string

    @IsNotEmpty()
    @IsString()
    description : string

    @IsNotEmpty()
    @IsNumber()
    price : number

    @IsNotEmpty()
    @IsNumber()
    quantity : number

    @IsNotEmpty()
    @IsString()
    color : string


}
