import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class UpdateLeadBalance {
    @ApiProperty({ type: String})
    @IsMongoId()
    lead: Types.ObjectId

    @ApiProperty()
    currency: string

    @ApiProperty()
    amount: number
}