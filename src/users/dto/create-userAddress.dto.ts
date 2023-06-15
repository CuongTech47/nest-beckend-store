import {IsNotEmpty, IsString} from "class-validator";


export class CreateUserAddressDto {
    @IsNotEmpty()
    @IsString()
    address : string
}