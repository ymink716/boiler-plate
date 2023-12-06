import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { QuestionEntity } from 'src/questions/infrastructure/entity/question.entity';
import { CommentLikeEntity } from 'src/likes/infrastructure/entity/comment-like.entity';

@Entity('comment')
export class CommentEntity {
  // constructor(options: {
  //   content: string;
  //   writer: User;
  //   question: QuestionEntity;
  // }) {
  //   if (options) {
  //     this.content = options.content;
  //     this.writer = options.writer;
  //     this.question = options.question;
  //   }
  // }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ 
    type: 'timestamp', 
    nullable: true 
  })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.comments)
  user: User;

  @ManyToOne(() => QuestionEntity, question => question.comments, {
    onDelete: 'CASCADE',
    nullable: false
  })
  question: QuestionEntity;

  @OneToMany(() => CommentLikeEntity, commentLike => commentLike.comment)
  likes: CommentLikeEntity[];
}
