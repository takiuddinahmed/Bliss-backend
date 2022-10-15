import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
@ObjectType()
export class FileData {
  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: String })
  spaceKey: string;

  @Prop({ type: String })
  spaceUrl: string;

  @Prop({ type: String })
  @Field(() => String)
  url: string;

  @Prop({ type: String })
  @Field(() => String)
  type?: string;

  @Prop({ type: Number })
  @Field(() => Int)
  size: number;
}
