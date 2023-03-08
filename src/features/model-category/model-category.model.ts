import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { FileData } from '../common';
import { ModelGallery } from '../model-gallery/model-gallery.model';

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class ModelCategory {
  @ApiProperty()
  @IsString()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({ required: false })
  @Prop({ type: FileData, default: {} })
  image?: FileData;

  @Prop({
    type: String,
    unique: true,
    slug: 'name',
    permanent: true,
  })
  permalink: string;
}

export type ModelCategoryDocument = HydratedDocument<ModelGallery>;
export const ModelCategorySchema = SchemaFactory.createForClass(ModelCategory);
