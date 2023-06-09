import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
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
import { LiveStreamModule } from './features/live-stream/live-stream.module';
import { NewsfeedCommentModule } from './features/newsfeed-comment/newsfeed-comment.module';
import { ModelGalleryModule } from './features/model-gallery/model-gallery.module';
import { LoggingInterceptor } from './features/common/interceptors/logging.interceptor';
import { ModelProfileModule } from './features/model-profile';
import { ActivityLogModule } from './features/activity-log/activity-log.module';
import { ModelPictureModule } from './features/model-picture/model-picture.module';
import { ModelCategoryModule } from './features/model-category/model-category.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { ModelVideosModule } from './features/model-videos/model-videos.module';

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
    LiveStreamModule,
    NewsfeedCommentModule,
    ModelGalleryModule,
    ModelProfileModule,
    ActivityLogModule,
    ModelPictureModule,
    ModelCategoryModule,
    NotificationsModule,
    ModelVideosModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
