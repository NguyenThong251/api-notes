import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body('zaloId') zaloId: string, @Body('name') name: string): Promise<User> {
    return this.usersService.login(zaloId, name);
  }
}
