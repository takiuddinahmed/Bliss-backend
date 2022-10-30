import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/features/auth/auth.module';
import { UserModule } from 'src/features/user/user.module';
import { CategoryModule } from './features/category';
import { ChannelModule } from './features/channel/channel.module';
import { ContentModule } from './features/content';
import { ContentTypeModule } from './features/content-type/content-type.module';
import { SpaceModule } from './features/space/space.module';
import { SubCategoryModule } from './features/sub-category/sub-category.module';
import { ContentCommentModule } from './features/content-comment/content-comment.module';
import { CouncilorController } from './features/councilor/councilor.controller';
import { CouncilorModule } from './features/councilor/councilor.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL || ''),
    UserModule,
    AuthModule,
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/features/schema.gql'),
    //   sortSchema: true,
    // }),
    CategoryModule,
    ContentModule,
    ContentTypeModule,
    ChannelModule,
    SpaceModule,
    SubCategoryModule,
    ContentCommentModule,
    CouncilorModule,
  ],
})
export class AppModule {}
