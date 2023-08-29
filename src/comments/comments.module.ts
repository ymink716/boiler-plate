import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entity/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormCommentsRepository } from './typeorm-comments.repository';

@Module({
  imports:[TypeOrmModule.forFeature([Comment])],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    {
      provide: 'COMMENTS_REPOSITORY',
      useClass: TypeormCommentsRepository,
    }
  ]
})
export class CommentsModule {}
