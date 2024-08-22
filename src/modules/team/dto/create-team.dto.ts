import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsMongoId, IsOptional } from "class-validator"

export class CreateTeamDto {
    @ApiProperty()
    name: string

    @ApiProperty()
    @IsOptional()
    color: string

    @ApiProperty()
    @IsOptional()
    description: string

    @ApiPropertyOptional({ type: String })
    @IsMongoId()
    @IsOptional()
    manager: string

    @ApiProperty({ type: [String] })
    @IsMongoId({ each: true })
    teamLeads: string[]

    @ApiProperty({ type: [String] })
    @IsMongoId({ each: true })
    sales: string[]
}
