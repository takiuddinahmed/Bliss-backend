import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { SubCategoryService } from './sub-category.service';
import { SubCategory } from './sub-category.model';
import { CreateSubCategoryInput } from './dto/create-sub-category.input';
import { UpdateSubCategoryInput } from './dto/update-sub-category.input';

@Resolver(() => SubCategory)
export class SubCategoryResolver {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Mutation(() => SubCategory)
  createSubCategory(
    @Args('input')
    createSubCategoryInput: CreateSubCategoryInput,
  ) {
    return this.subCategoryService.create(createSubCategoryInput);
  }

  @Query(() => [SubCategory], { name: 'subCategories' })
  findAll() {
    return this.subCategoryService.findAll();
  }
  @Query(() => [SubCategory], { name: 'subCategoriesByCateogory' })
  findByCategory(@Args('categoryId', { type: () => ID }) categoryId: string) {
    return this.subCategoryService.findByCategory(categoryId);
  }

  @Query(() => SubCategory, { name: 'subCategory' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.subCategoryService.findOne(id);
  }

  @Mutation(() => SubCategory)
  updateSubCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('input')
    updateSubCategoryInput: UpdateSubCategoryInput,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryInput);
  }

  @Mutation(() => SubCategory)
  removeSubCategory(@Args('id', { type: () => String }) id: string) {
    return this.subCategoryService.remove(id);
  }
}
