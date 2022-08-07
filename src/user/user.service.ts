import {
  HttpException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from 'src/utils/bcrypt.util';
import { EditPassDto } from './dto/editPassword.dto';
import { EditUserDto } from './dto/editUser.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAll() {
    return await this.userModel
      .find()
      .select('firstName lastName email phoneNumber role');
  }

  async register(registerDto: RegisterDto): Promise<User> {
    if (registerDto.password !== registerDto.confirmPassword)
      throw new HttpException('Confirm Password not match', 400);

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

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotAcceptableException('Invalid credential');
    return user;
  }

  async getOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('firstName lastName email phoneNumber role');
    if (!user) throw new NotFoundException();
    return user;
  }

  async editUser(id: string, editUserDto: EditUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return await this.userModel
      .findByIdAndUpdate(id, editUserDto, { new: true })
      .select('firstName lastName email phoneNumber role');
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
