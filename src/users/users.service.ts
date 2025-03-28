import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async login(zaloId: string, name: string): Promise<User> {
    let user = await this.userModel.findOne({ zaloId }).exec();
    if (!user) {
      user = new this.userModel({ zaloId, name });
      await user.save();
    }
    return user;
  }
}
