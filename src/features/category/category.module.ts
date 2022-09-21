import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver';

@Module({
  imports: [],
  providers: [CategoryResolver],
})
export class CategoryModule {}
