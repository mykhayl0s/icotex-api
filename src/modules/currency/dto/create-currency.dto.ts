import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCurrencyDto {
  _id: string | Types.ObjectId;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  symbol: string;

  @ApiProperty()
  @IsNumber()
  exchangeRate: number;
}
