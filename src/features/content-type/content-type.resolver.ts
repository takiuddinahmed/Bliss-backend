import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ContentTypeService } from './content-type.service';
import { ContentType } from './content-type.model';
import { CreateContentTypeInput } from './create-content-type.input';
import { UpdateContentTypeInput } from './update-content-type.input';

@Resolver(() => ContentType)
export class ContentTypeResolver {
  constructor(private readonly contentTypeService: ContentTypeService) {}

  @Mutation(() => ContentType)
  createContentType(
    @Args('createContentTypeInput')
    createContentTypeInput: CreateContentTypeInput,
  ) {
    return this.contentTypeService.create(createContentTypeInput);
  }

  @Query(() => [ContentType], { name: 'contentTypes' })
  findAll() {
    return this.contentTypeService.findAll();
  }

  @Query(() => ContentType, { name: 'contentType' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.contentTypeService.findOne(id);
  }

  @Mutation(() => ContentType)
  updateContentType(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateContentTypeInput')
    updateContentTypeInput: UpdateContentTypeInput,
  ) {
    return this.contentTypeService.update(id, updateContentTypeInput);
  }

  @Mutation(() => ContentType)
  deleteContentType(@Args('id', { type: () => ID }) id: string) {
    return this.contentTypeService.remove(id);
  }
}
