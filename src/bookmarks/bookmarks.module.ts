import { Module } from '@nestjs/common';
import { BookmarksController } from './presentation/bookmarks.controller';
import { BookmarksService } from './application/bookmarks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormBookmarksRepository } from './infrastructure/typeorm-bookmarks.repository';
import { QuestionsModule } from 'src/questions/questions.module';
import { BOOKMARKS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { BookmarkEntity } from './infrastructure/entity/bookmark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookmarkEntity]),
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
