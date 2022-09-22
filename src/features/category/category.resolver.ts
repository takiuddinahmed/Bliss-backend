import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';

@Resolver()
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { name: 'categories' })
  async getCategories() {
    return this.categoryService.getCategories();
  }
  @Query(() => Category, { name: 'category' })
  async getCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.getCategory(id);
  }

  @Mutation(() => Category)
  async createCategory(@Args('input') createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Mutation(() => Category)
  async deleteCategory(@Args('id', { type: () => ID }) id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
