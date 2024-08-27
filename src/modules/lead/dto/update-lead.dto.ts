import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateLeadDto } from './create-lead.dto';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @ApiPropertyOptional()
  _id: string;
}
