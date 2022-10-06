import { InputType, PartialType } from '@nestjs/graphql';
import { CreateChannelInput } from './create-channel.input';

@InputType()
export class UpdateChannelInput extends PartialType(CreateChannelInput) {}
