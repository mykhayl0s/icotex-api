import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VereficationDto {
  lead: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  verificationType: string;
}

export class UpdateVerificationDto extends PartialType(VereficationDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  lead: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  verificationType: string;
}
