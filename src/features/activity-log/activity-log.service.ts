import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLogDTO } from './dto/activity-log.dto';
import { ActivityLogDocument } from './activity-log.model';
import { collectionNames } from '../common';
import { createSearchQuery } from '../utils';


@Injectable()
export class ActivityLogService {
    private readonly logger = new Logger(ActivityLogService.name);

    constructor(
        @InjectModel(collectionNames.activityLog)
        private readonly logModel: Model<ActivityLogDocument>,
    ) { }

    create(logDTO: ActivityLogDTO) {
        try {
            return new this.logModel(logDTO).save();
        } catch (err) {
            throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(query) {
        try {
            const searchQuery = createSearchQuery(query);
            const limit: number = (query && query.limit) || 10;
            const skip: number = (query && query.skip) || 0;
            const cursor = this.logModel
                .find(searchQuery)
                .populate("userId")
                .limit(limit)
                .skip(skip);
            if (query.hasOwnProperty('sort') && query.sort) {
                cursor.sort(JSON.parse(query.sort));
            }
            const res = await cursor.exec();
            return res;
        } catch (err) {
            throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
        }
    }
}
