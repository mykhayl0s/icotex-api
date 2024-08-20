import { ApiProperty } from "@nestjs/swagger"
import { ERole } from "../schemas/user.schema"
import { IsEnum, IsString } from "class-validator"

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    password: string

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    email: string

    @ApiProperty({ enum: ERole })
    @IsEnum(ERole)
    team: ERole
}
