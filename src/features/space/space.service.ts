import { Injectable, Logger } from '@nestjs/common';
import { Credentials, Endpoint, S3 } from 'aws-sdk';

@Injectable()
export class SpaceService {
  private logger = new Logger(SpaceService.name);
  private s3: S3;
  private bucket: string;
  constructor() {
    this.s3 = this.getS3();
    this.bucket = process.env.DO_SPACE_BUCKET;
    console.log(this.s3.listBuckets());
  }

  async uploadFile(file: Express.Multer.File, name?: string) {
    try {
      const fileName = (name ? name : file.filename) + '-' + this.genUniqeId();
      const stored = await this.s3
        .upload({
          Bucket: this.bucket,
          ACL: 'public',
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
      console.log(err);
      return null;
    }
  }

  getS3() {
    const spaceEndPoint = new Endpoint(process.env.DO_SPACE_ENDPOINT);
    const s3 = new S3({
      endpoint: spaceEndPoint,
      region: process.env.DO_SPACE_REGION,
      credentials: new Credentials({
        accessKeyId: process.env.DO_SPACE_SECRET_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACE_SECRET_ACCESS_KEY,
      }),
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
