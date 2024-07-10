import { ApiProperty } from '@nestjs/swagger';
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
import { UserEntity } from 'src/users/infrastructure/entity/user.entity';

@Entity('comment')
export class CommentEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
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

  @ManyToOne(() => UserEntity, user => user.comments)
  user: UserEntity;

  @ManyToOne(() => QuestionEntity, question => question.comments, {
    onDelete: 'CASCADE',
    nullable: false
  })
  question: QuestionEntity;

  @OneToMany(() => CommentLikeEntity, commentLike => commentLike.comment)
  likes: CommentLikeEntity[];
}
