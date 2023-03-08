import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import {
    IsMongoId,
    IsString,
} from 'class-validator';
import { collectionNames } from '../common';

export type ActivityLogDocument = ActivityLog & Document;

@Schema()
export class ActivityLog {
    @IsMongoId()
    @Prop({
        type: Types.ObjectId,
        ref: collectionNames.user,
        required: true,
    })
    userId: Types.ObjectId | string;

    @IsString()
    @Prop()
    activityType: string;

    @IsString()
    @Prop()
    activityName: string;

    @Prop({
        type: SchemaTypes.Mixed,
    })
    actionInfo: Record<string, unknown>;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

