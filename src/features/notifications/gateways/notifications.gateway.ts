import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDTO, UpdateNotificationDTO } from '../dto';
import {
  CREATE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  FIND_ALL_NOTIFICATION,
} from '../mock/message.mock';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly notificationsService: NotificationsService) {}

  // @SubscribeMessage(CREATE_NOTIFICATION)
  // create(@MessageBody() createNotificationDto: CreateNotificationDTO) {
  //   return this.notificationsService.create(createNotificationDto);
  // }

  @SubscribeMessage(UPDATE_NOTIFICATION)
  update(@MessageBody() updateNotificationDto: UpdateNotificationDTO) {
    return this.notificationsService.update(
      updateNotificationDto.id,
      updateNotificationDto,
    );
  }

  // @SubscribeMessage(FIND_ALL_NOTIFICATION)
  // findAll(@MessageBody() query, socket: Socket) {
  //   // console.log("socket id : ", Socket);
  //
  //   return this.notificationsService.findAll(query);
  // }
}
