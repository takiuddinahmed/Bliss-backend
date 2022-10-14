import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Content } from './content.model';
import { ContentService } from './content.service';
import { CreateContentDto } from './create-content.dto';
import { UpdateContentDto } from './update-content.dto';

@Resolver()
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Query(() => [Content], { name: 'contents' })
  async getContents() {
    return this.contentService.getContents();
  }
  @Query(() => Content, { name: 'content' })
  async getContent(@Args('id', { type: () => ID }) id: string) {
    return this.contentService.getContent(id);
  }

  @Mutation(() => Content)
  async createContent(@Args('input') createContentDto: CreateContentDto) {
    return this.contentService.createContent(createContentDto);
  }
  @Mutation(() => Content)
  async updateContent(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.updateContent(id, updateContentDto);
  }

  @Mutation(() => Content, { name: 'deleteContent' })
  async deleteContent(@Args('id', { type: () => ID }) id: string) {
    return this.contentService.deleteContent(id);
  }
}
