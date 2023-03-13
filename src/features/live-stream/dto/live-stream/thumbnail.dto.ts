import { ApiProperty } from '@nestjs/swagger';

export class ThumbnailsUploadDTO implements Readonly<ThumbnailsUploadDTO> {
    @ApiProperty({ type: 'string', format: 'binary' })
    thumbnails?: Express.Multer.File[];
}
