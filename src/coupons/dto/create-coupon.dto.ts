import {IsDate, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateCouponDto {
    @IsNotEmpty()
    @IsString()
    name : string

    @IsNotEmpty()
    @IsString()
    expiry : string

    @IsNotEmpty()
    @IsNumber()
    discount : number
}
