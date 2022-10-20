import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { collectionNames } from '../common';
import { SpaceModule } from '../space';
import { UserController } from './user.controller';
import { UserSchema } from './user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: collectionNames.user, schema: UserSchema },
    ]),
    SpaceModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
