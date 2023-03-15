import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { ThreadService, ChatService } from './services';
import { ThreadSchema, ChatSchema } from './models';
// import { ChatController, ThreadController } from './controllers';
import { UserSchema } from '../user/user.model';
import { collectionNames } from '../common';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: collectionNames.thread, schema: ThreadSchema },
            { name: collectionNames.chat, schema: ChatSchema },
            { name: collectionNames.user, schema: UserSchema },
        ]),
    ],
    // controllers: [ThreadController, ChatController],
    // providers: [ThreadService, ChatService],
})
export class ThreadModule { }
