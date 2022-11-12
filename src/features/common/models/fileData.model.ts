import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class FileData {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  spaceKey: string;

  @Prop({ type: String })
  spaceUrl: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: String })
  type?: string;

  @Prop({ type: Number })
  size: number;
}

export type FileDataDocument = FileData & Document;
export const FileDataSchema = SchemaFactory.createForClass(FileData);
