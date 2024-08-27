import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTeamDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  color: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ type: String })
  // @IsString()
  // @IsMongoId()
  @Transform(({ value }) => new Types.ObjectId(value as string))
  manager: string;

  @ApiProperty({ type: [String] })
  // @IsMongoId({ each: true })
  // @IsString({ each: true })
  @Transform(({ value }) => value.map((el) => new Types.ObjectId(el as string)))
  teamLeads: string[];

  @ApiProperty({ type: [String] })
  // @IsMongoId({ each: true })
  // @IsString({ each: true })
  @Transform(({ value }) => value.map((el) => new Types.ObjectId(el as string)))
  sales: string[];

  @ApiProperty({ type: [String] })
  // @IsMongoId({ each: true })
  // @IsString({ each: true })
  @Transform(({ value }) => value.map((el) => new Types.ObjectId(el as string)))
  retentions: string[];
}
