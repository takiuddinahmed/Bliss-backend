import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDTO, UpdateNotificationDTO } from '../dto';
import { Server } from 'socket.io';
import { INotification, INotificationWithCount } from '../interfaces';
import { collectionNames } from '../../common';

@WebSocketGateway({ cors: true })
@Injectable()
export class NotificationsService {
  @WebSocketServer() server: Server;
  /**
   * Constructor
   * @param {Model<INotification>} notificationModel,
   */
  constructor(
    @InjectModel(collectionNames.notification)
    private readonly notificationModel: Model<INotification>,
  ) {}

  /**
   * Create Notification
   * @param {CreateNotificationDTO} createNotificationDto
   * @returns {Promise<INotification>}
   */
  async create(
    createNotificationDto: CreateNotificationDTO,
  ): Promise<INotification> {
    try {
      const result = await new this.notificationModel(
        createNotificationDto,
      ).save();

      const notification = await this.notificationModel
        .findOne({
          _id: result._id,
        })
        .populate('sender')
        .populate('receivers.userId')
        .exec();

      createNotificationDto?.receivers?.map(async (receiver) => {
        const unreadCount = await this.notificationModel.countDocuments({
          'receivers.userId': receiver.userId,
          'isRead': false,
        });

        this.server.emit(`notification-${receiver.userId}`, {
          notification: notification,
          unreadCount: unreadCount,
        });
      });

      return notification;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * update Notification
   * @Param {string} id
   * @Body {UpdateNotificationDTO} updateNotificationDTO
   * @returns {Promise<INotification>}
   */
  async update(id: string, updateNotificationDTO: UpdateNotificationDTO) {
    try {
      const notification = await this.notificationModel.findOne({ _id: id });
      return await notification.set(updateNotificationDTO).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * find all notifications
   * @returns {Promise<INotificationWithCount>}
   */
  async findAll(user, query): Promise<INotificationWithCount> {
    try {
      return;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
