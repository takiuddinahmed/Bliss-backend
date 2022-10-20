import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/features/utils/bcrypt.util';
import { collectionNames } from '../common';
import { SpaceService } from '../space/space.service';
import { EditPassDto } from './dto/editPassword.dto';
import { EditUserDto } from './dto/editUser.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(collectionNames.user) private userModel: Model<UserDocument>,
    private readonly spaceService: SpaceService,
  ) {}

  async getAll() {
    return await this.userModel
      .find()
      .select('firstName lastName email phoneNumber role');
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const existUser = await this.userModel.findOne({
      email: registerDto.email,
    });

    if (existUser) {
      console.log({ existUser });
      throw new HttpException('The email is registered already', 400);
    }

    const hashedPassword = hashPassword(registerDto.password);
    registerDto.password = hashedPassword;
    const registeredUser = new this.userModel(registerDto);
    const savedUser = await registeredUser.save();
    return this.userModel
      .findById(savedUser._id)
      .select('firstName lastName email phoneNumber role');
  }

  async addChannelToUser(userId: string, channelId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');
    return await this.userModel.findByIdAndUpdate(
      userId,
      { channelId },
      { new: true },
    );
  }

  async removeChannelFromUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');
    return await this.userModel.findByIdAndUpdate(
      userId,
      { channelId: '' },
      { new: true },
    );
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotAcceptableException('Invalid credential');
    return user;
  }

  async getOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('firstName lastName email phoneNumber role channelId');
    if (!user) throw new NotFoundException();
    return user;
  }

  async editUser(
    id: string,
    editUserDto: EditUserDto,
    proPicFile?: Express.Multer.File,
  ) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    if (proPicFile) {
      const proPicData = await this.spaceService.uploadFile(proPicFile);
      if (!proPicData) {
        throw new InternalServerErrorException('File upload failed');
      }
      editUserDto.proPic = proPicData.url;
    }
    return await this.userModel
      .findByIdAndUpdate(id, editUserDto, { new: true })
      .select({ password: 0 });
  }

  async findAndUpdate(id: string) {
    await this.userModel.findByIdAndUpdate(
      id,
      {
        channelId: '',
      },
      { new: true },
    );
  }

  async editPassword(id: string, editPassDto: EditPassDto) {
    if (editPassDto.password !== editPassDto.confirmPassword)
      throw new HttpException('Confirm password not match', 400);

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    if (!comparePassword(user.password, editPassDto.oldPassword))
      throw new HttpException('Invalid credential provided', 401);
    return await this.userModel
      .findByIdAndUpdate(id, editPassDto, { new: true })
      .select('firstName lastName email phoneNumber role');
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    return await this.userModel
      .findByIdAndDelete(id)
      .select('firstName lastName email phoneNumber role');
  }
}
