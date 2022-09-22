import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/features/user/user.module';
import { AuthModule } from 'src/features/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CategoryModule } from './features/category/category.module';
import { ContentModule } from './features/content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL || ''),
    UserModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/features/schema.gql'),
      sortSchema: true,
    }),
    CategoryModule,
    ContentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
