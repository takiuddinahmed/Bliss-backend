import { Injectable, Logger } from '@nestjs/common';
import { Endpoint, S3 } from 'aws-sdk';

@Injectable()
export class SpaceService {
  private logger = new Logger(SpaceService.name);
  private s3: S3;
  private bucket: string;
  constructor() {
    this.s3 = this.getS3();
    this.bucket = process.env.DO_SPACE_BUCKET;
  }

  async uploadFile(file: Express.Multer.File, name?: string) {
    try {
      const fileName =
        this.genUniqeId() +
        '-' +
        (name ? name : file.originalname.replace(' ', '-'));

      const stored = await this.s3
        .upload({
          Bucket: this.bucket + '/files',
          ACL: 'public-read',
          Key: fileName,
          Body: file.buffer,
        })
        .promise();
      return {
        spaceKey: stored.Key,
        spaceUrl: stored.Location,
      };
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }

  getS3() {
    const endpoint = process.env.DO_SPACE_ENDPOINT;
    const region = process.env.DO_SPACE_REGION;
    const accessKeyId = process.env.DO_SPACE_ACCESS_KEY_ID;
    const secretAccessKey = process.env.DO_SPACE_SECRET_ACCESS_KEY;
    const spaceEndPoint = new Endpoint(endpoint);
    const s3 = new S3({
      endpoint: spaceEndPoint.href,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    return s3;
  }

  genUniqeId() {
    return Date.now()
      .toString()
      .slice(12 - 5, -1)
      .toString();
  }
}
