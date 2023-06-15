import {IsNotEmpty, IsString} from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty()
    @IsString()
    address : string


    @IsNotEmpty()
    @IsString()
    city : string


}
