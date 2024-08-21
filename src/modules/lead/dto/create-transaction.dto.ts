import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';


export class CreateTransactionDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    lead: Types.ObjectId;

    user: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    currency: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;
}

export class UpdateTransactionDto {
    @ApiProperty({ type: String })
    @IsMongoId()
    transaction: Types.ObjectId;

    user: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    currency: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;
}