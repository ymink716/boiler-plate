import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entity/bookmark.entity';
import { TypeormBookmarksRepository } from './repository/typeorm-bookmarks.repository';
import { QuestionsModule } from 'src/questions/questions.module';
import { BOOKMARKS_REPOSITORY } from 'src/common/constants/tokens.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark]),
    QuestionsModule,
  ],
  controllers: [BookmarksController],
  providers: [
    BookmarksService,
    {
      provide: BOOKMARKS_REPOSITORY,
      useClass: TypeormBookmarksRepository,
    },
  ],
})
export class BookmarksModule {}
