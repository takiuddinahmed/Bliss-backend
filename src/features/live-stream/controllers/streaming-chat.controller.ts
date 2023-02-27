import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  CreateStreamChatDto,
  SearchStreamChatDTO,
  UpdateStreamChatDto,
} from '../dto';
import { JwtAuthGuard, Roles, RolesGuard } from '../../security';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../../security/get-user.decorator';
import { StreamChatService } from '../services';

@ApiTags('LiveStream')
@ApiBearerAuth()
@Controller('livestream/chat')
export class StreamChatController {
  constructor(private readonly liveStreamChatService: StreamChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@AuthUser() user, @Body() createChatDto: CreateStreamChatDto) {
    try {
      return this.liveStreamChatService.create(user, createChatDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: SearchStreamChatDTO) {
    return this.liveStreamChatService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStreamChatDto: UpdateStreamChatDto,
    @AuthUser() user,
  ) {
    return this.liveStreamChatService.update(id, updateStreamChatDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liveStreamChatService.remove(id);
  }
}
