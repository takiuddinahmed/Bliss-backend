import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Document, SchemaTypes } from 'mongoose';
import { IsArray, ArrayMinSize } from 'class-validator';
import { ParticipantSchema, ParticipantDocument } from './participant.model';

export type ThreadDocument = Thread & Document;
@Schema()
export class Thread {
    @ApiProperty({ enum: ['true', 'false'] })
    @Transform(({ value }) =>
        typeof value === 'string' ? value === 'true' : value,
    )
    @Prop({ type: Boolean, default: false })
    isGroup: boolean;

    @IsArray()
    @ArrayMinSize(2)
    @Prop({
        type: [ParticipantSchema]
    })
    participants: ParticipantDocument[];
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
