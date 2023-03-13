import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateNotificationDTO,
  UpdateNotificationDTO,
  SearchNotificationDto,
} from '../dto';
import { Server } from 'socket.io';
import { INotification, INotificationWithCount } from '../interfaces';
import { collectionNames } from '../../common';
import { createSearchQuery } from '../../utils';

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
  ) { }

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
        .populate('receiver')
        .exec();

      const unreadCount = await this.notificationModel.countDocuments({
        receiver: createNotificationDto.receiver,
        isRead: false,
      });

      this.server.emit(`notification-${createNotificationDto.receiver}`, {
        notification: notification,
        unreadCount: unreadCount,
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

  async updateReadBulk(user) {
    try {
      return await this.notificationModel.updateMany(
        {
          receiver: user._id,
          isRead: false,
        },
        { $set: { isRead: true } },
      );

    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * find all notifications
   * @returns {Promise<INotificationWithCount>}
   */
  async findAll(
    user,
    query: SearchNotificationDto,
  ): Promise<INotificationWithCount> {
    try {
      const searchQuery = createSearchQuery(query);
      searchQuery.receiver = String(user._id);
      console.log(searchQuery)
      const limit: number = (query && query.limit) || 100;
      const skip: number = (query && query.skip) || 0;

      const cursor = this.notificationModel
        .find(searchQuery)
        .populate('sender')
        .populate('receiver')
        .limit(limit)
        .skip(skip);
      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const notifications = await cursor.exec();

      searchQuery.isRead = false;

      const unreadCount = await this.notificationModel.countDocuments(
        searchQuery,
      );

      return {
        notifications: notifications,
        unreadCount: unreadCount,
      };
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
