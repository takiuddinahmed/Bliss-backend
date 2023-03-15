import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { collectionNames } from '../../common';
import {
    IsString,
    IsMongoId,
    IsArray,
    ArrayMinSize,
} from 'class-validator';
import { ParticipantSchema, ParticipantDocument } from './participant.model';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';


export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
    @IsMongoId()
    @Prop({
        type: Types.ObjectId,
        ref: collectionNames.thread,
        required: true
    })
    threadId: Types.ObjectId | string;

    @IsString()
    @Prop({ type: String })
    message: string;

    @Prop({
        type: SchemaTypes.ObjectId,
        ref: collectionNames.user,
        required: true
    })
    sender: Types.ObjectId | string;

    @IsArray()
    @ArrayMinSize(1)
    @Prop({
        type: [ParticipantSchema]
    })
    receivers: ParticipantDocument[];

    @ApiProperty({ enum: ['true', 'false'] })
    @Transform(({ value }) =>
        typeof value === 'string' ? value === 'true' : value,
    )
    @Prop({ type: Boolean, default: false })
    isDelete: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

