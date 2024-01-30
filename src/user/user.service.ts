import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';
import { User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  async getMe(user: User) {
    const cachedUser = await this.cacheManager.get(`cached_user_${user.id}`);
    if (!cachedUser) {
      await this.cacheManager.set(`cached_user_${user.id}`, user);
      return user;
    }
    console.log('user taken from cache');
    return cachedUser;
  }
  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    delete user.hash;
    await this.cacheManager.set(`cached_user_${userId}`, user);
    return user;
  }
}
