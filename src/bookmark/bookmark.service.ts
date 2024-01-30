import { ForbiddenException, Injectable, Inject } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class BookmarkService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  async getBookmarks(userId: number) {
    const cachedBookmarks = await this.cacheManager.get(
      `cached_bookmarks_userId:${userId}`,
    );

    if (!cachedBookmarks) {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: {
          userId,
        },
      });

      await this.cacheManager.set(
        `cached_bookmarks_userId:${userId}`,
        bookmarks,
      );

      console.log('bookmarks taken from the database');
      return bookmarks;
    }

    console.log('bookmarks taken from cache');
    return cachedBookmarks;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const cachedBookmark = await this.cacheManager.get(
      `cached_bookmark_userId:${userId}_bookmarkId:${bookmarkId}`,
    );

    if (!cachedBookmark) {
      const bookmark = await this.prisma.bookmark.findFirst({
        where: {
          id: bookmarkId,
          userId,
        },
      });

      await this.cacheManager.set(
        `cached_bookmark_userId:${userId}_bookmarkId:${bookmarkId}`,
        bookmark,
      );

      console.log('bookmark taken from the database');
      return bookmark;
    }

    console.log('bookmark taken from cache');
    return cachedBookmark;
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    await this.cacheManager.del(`cached_bookmarks_userId:${userId}`);

    await this.cacheManager.set(
      `cached_bookmark_userId:${userId}_bookmarkId:${bookmark.id}`,
      bookmark,
    );

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns bookmark
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resourse dinied');
    }

    const updatedBookmark = this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });

    const cachedBookmark = await this.cacheManager.get(
      `cached_bookmark_userId:${userId}_bookmarkId:${bookmarkId}`,
    );

    if (cachedBookmark) {
      await this.cacheManager.del(`cached_bookmarks_userId:${userId}`);
      await this.cacheManager.del(
        `cached_bookmark_userId:${userId}_bookmarkId:${bookmarkId}`,
      );
    }

    await this.cacheManager.set(
      `cached_bookmark_userId:${userId}_bookmarkId:${bookmarkId}`,
      updatedBookmark,
    );
    return updatedBookmark;
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns bookmark
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException('Access to resourse dinied');
    }

    await this.cacheManager.del(
      `cached_bookmark_userId:${userId}_bookmarkId:${bookmarkId}`,
    );

    await this.cacheManager.del(`cached_bookmarks_userId:${userId}`);

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
