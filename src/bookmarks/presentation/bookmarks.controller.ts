import { Controller, Delete, Post, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookmarksService } from '../application/bookmarksService';

@Controller('bookmarks')
@ApiTags('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @ApiOperation({ 
    summary: '북마크 추가', 
    description: '해당 질문에 북마크를 추가합니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiCreatedResponse({ 
    description: '북마크 추가 성공',
  })
  @Post('/questions/:questionId')
  @UseGuards(JwtAuthGuard)
  async addBookmark(
    @GetUser('id') userId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    await this.bookmarksService.addBookmark(userId, questionId);

    return { success: true };
  }

  @ApiOperation({ 
    summary: '북마크 삭제', 
    description: '해당 질문에 대한 북마크를 삭제합니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiOkResponse({
    description: '북마크 삭제 성공'
  })
  @Delete('/questions/:questionId')
  @UseGuards(JwtAuthGuard)
  async deleteBookmark(
    @GetUser('id') userId: number,
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    await this.bookmarksService.deleteBookmark(userId, questionId);

    return { success: true };
  }
}
