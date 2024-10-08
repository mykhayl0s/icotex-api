import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsMongoId,
} from 'class-validator';

export class Balance {
  [key: string]: number;
}

export class CreateLeadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsPhoneNumber(null)
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Balance)
  @IsNotEmpty()
  @IsOptional()
  balance: Balance;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sale: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  source: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  retention: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  currency: string;
}
