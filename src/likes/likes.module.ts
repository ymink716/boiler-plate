import { Module } from '@nestjs/common';
import { LikesController } from './presentation/likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLikeEntity } from './infrastructure/entity/comment-like.entity';
import { TypeormCommentLikesRepository } from './infrastructure/typeorm-comment-likes.repository';
import { CommentsModule } from 'src/comments/comments.module';
import { COMMENT_LIKES_REPOSITORY } from 'src/common/constants/tokens.constant';
import { LikesService } from './application/likes.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([CommentLikeEntity]),
    CommentsModule,
  ],
  controllers: [LikesController],
  providers: [
    LikesService,
    {
      provide: COMMENT_LIKES_REPOSITORY,
      useClass: TypeormCommentLikesRepository,
    },
  ]
})
export class LikesModule {}
