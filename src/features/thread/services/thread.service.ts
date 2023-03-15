import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CreateThreadDto,
    UpdateChatDto,
    CreateChatDto,
} from '../dto';
import { IThread, IThreadsWithCount } from '../interfaces';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IChat } from '../interfaces';
// import { ChatService } from './chat.service';
/**
 * Thread Service
 */
@WebSocketGateway({ cors: true })
@Injectable()
export class ThreadService {
    @WebSocketServer() server: Server;
    private readonly password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';

    /**
     * Constructor
     * @param {Model<IThread>} threadModel
     * @param {Model<ChatService>} chatService
     */
    constructor(
        @InjectModel('Thread')
        private readonly threadModel: Model<IThread>,
        // private readonly chatService: ChatService,
    ) { }
}

