import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsMongoId } from "class-validator"

export class CreateTeamDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    color: string

    @ApiPropertyOptional({ type: String })
    @IsMongoId()
    manager: string

    @ApiProperty({ type: [String] })
    @IsMongoId({ each: true })
    teamLeads: string[]

    @ApiProperty({ type: [String] })
    @IsMongoId({ each: true })
    sales: string[]
}
