import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';
import { IsMongoId } from 'class-validator';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
    @ApiProperty()
    @IsMongoId()
    id: string
}
