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
import { CouncilorModule } from './features/councilor/councilor.module';
import { RestaurantsModule } from './features/restaurants/restaurants.module';
import { RestaurantBookingModule } from './features/restaurant-booking/restaurant-booking.module';
import { CouncilorAppoinmentModule } from './features/councilor-appoinment';
import { RestaurantMenuModule } from './features/restaurant-menu/restaurant-menu.module';
import { RestaurantCategoryModule } from './features/restaurant-category/restaurant-category.module';
import { ResortTypeModule } from './features/resort-type/resort-type.module';
import * as mongooseAutopopulate from 'mongoose-autopopulate';
import * as slug from 'mongoose-slug-updater';
import { ResortModule } from './features/resort';
import { PaymentModule } from './features/payment/payment.module';
import { NewsfeedModule } from './features/newsfeed';
import { NewsfeedCommentModule } from './features/newsfeed-comment/newsfeed-comment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL || '', {
      connectionFactory: (connection) => {
        connection.plugin(mongooseAutopopulate);
        connection.plugin(slug);
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ContentModule,
    ContentTypeModule,
    ChannelModule,
    SpaceModule,
    SubCategoryModule,
    ContentCommentModule,
    CouncilorModule,
    RestaurantsModule,
    RestaurantBookingModule,
    CouncilorAppoinmentModule,
    RestaurantMenuModule,
    RestaurantCategoryModule,
    ResortTypeModule,
    ResortModule,
    PaymentModule,
    NewsfeedModule,
    NewsfeedCommentModule,
  ],
})
export class AppModule {}
