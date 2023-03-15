import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';
import {
    IsBoolean,
    IsMongoId,
    IsOptional,
} from 'class-validator';
import { collectionNames } from '../../common';

export type ParticipantDocument = Participant & Document;
@Schema()
export class Participant {
    @IsMongoId()
    @Prop({
        type: Types.ObjectId,
        ref: collectionNames.user,
        required: true
    })
    userId: Types.ObjectId | string;

    @ApiProperty({ enum: ['true', 'false'] })
    @Transform(({ value }) =>
        typeof value === 'string' ? value === 'true' : value,
    )
    @Prop({ type: Boolean, default: false })
    isRead: boolean;

    @ApiProperty({ enum: ['true', 'false'] })
    @Transform(({ value }) =>
        typeof value === 'string' ? value === 'true' : value,
    )
    @Prop({ type: Boolean, default: false })
    isOnline: boolean;

    @IsOptional()
    @ApiProperty({ enum: ['true', 'false'] })
    @Transform(({ value }) =>
        typeof value === 'string' ? value === 'true' : value,
    )
    @IsBoolean()
    @Prop({ type: Boolean, default: false })
    isDeleted?: boolean;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
