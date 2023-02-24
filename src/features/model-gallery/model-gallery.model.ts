import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { collectionNames } from '../common';
import { LifeStyleEnum } from '../common/enum';
import { ModelGalleryModule } from './model-gallery.module';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ModelGallery {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: true,
    ref: collectionNames.user,
  })
  userId: Types.ObjectId | string;

  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  profileName: string;

  @ApiProperty({ enum: LifeStyleEnum, isArray: true })
  @IsEnum(LifeStyleEnum, { each: true })
  @Prop({ type: [String], required: true })
  lifeStyle: LifeStyleEnum[];

  @ApiProperty()
  @IsMongoId({ each: true })
  @Prop([{ type: Types.ObjectId, ref: collectionNames.category }])
  categoryId: Types.ObjectId[];
}

export type ModelGalleryDocument = HydratedDocument<ModelGallery>;
export const ModelGallerySchema = SchemaFactory.createForClass(ModelGallery);
