import { IsDecimal, IsNotEmpty, IsPositive } from "class-validator";

export class CreateDollarDto {
    @IsNotEmpty()
    @IsPositive()
    value: number;
}
