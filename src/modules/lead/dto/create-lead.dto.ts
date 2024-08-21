import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsPhoneNumber, IsNotEmpty, IsOptional, IsNumber, ValidateNested } from 'class-validator';

export class Balance {
    [key: string]: number;
}

export class CreateLeadDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullname: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsPhoneNumber(null)
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;

    @ApiProperty()
    @ValidateNested()
    @Type(() => Balance)
    @IsNotEmpty()
    balance: Balance;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    deposited: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    sale: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    status: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    comment: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    messagesCount: number;
}
