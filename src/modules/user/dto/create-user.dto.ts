import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsString } from "class-validator"
import { ERole } from "src/common/roles.enum"

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
    role: ERole
}
