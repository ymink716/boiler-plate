import { Controller, Delete, Post, UseGuards, Param } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('/questions/:questionId')
  @UseGuards(JwtAuthGuard)
  async addBookmark(
    @GetUser() user: User,
    @Param('questionId') questionId: number,
  ) {
    await this.bookmarksService.addBookmark(user, questionId);

    return { success: true };
  }

  @Delete('/questions/:questionId')
  @UseGuards(JwtAuthGuard)
  async deleteBookmark(
    @GetUser('id') userId: number,
    @Param('questionId') questionId: number,
  ) {
    await this.bookmarksService.deleteBookmark(userId, questionId);

    return { success: true };
  }
}
