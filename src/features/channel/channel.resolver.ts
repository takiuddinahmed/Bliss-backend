import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChannelService } from './channel.service';
import { Channel } from './channel.model';
import { CreateChannelInput } from './dto/create-channel.input';
import { UpdateChannelInput } from './dto/update-channel.input';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Mutation(() => Channel)
  createChannel(@Args('input') createChannelInput: CreateChannelInput) {
    return this.channelService.create(createChannelInput);
  }

  @Query(() => [Channel], { name: 'channels' })
  findAll() {
    return this.channelService.findAll();
  }

  @Query(() => Channel, { name: 'channel' })
  findOne(@Args('permalink', { type: () => String }) permalink: string) {
    return this.channelService.findOne(permalink);
  }

  @Mutation(() => Channel)
  updateChannel(
    @Args('id', { type: () => String }) id: string,
    @Args('input') updateChannelInput: UpdateChannelInput,
  ) {
    return this.channelService.update(id, updateChannelInput);
  }

  @Mutation(() => Channel)
  removeChannel(@Args('id', { type: () => String }) id: string) {
    return this.channelService.remove(id);
  }
}
