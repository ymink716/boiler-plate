import { ApiProperty } from "@nestjs/swagger";
import { BookmarkEntity } from "src/bookmarks/infrastructure/entity/bookmark.entity";
import { CommentEntity } from "src/comments/infrastructure/entity/comment.entity";
import { UserProvider } from "src/common/enums/user-provider.enum";
import { QuestionLikeEntity } from "src/likes/infrastructure/entity/question-like.entity";
import { QuestionEntity } from "src/questions/infrastructure/entity/question.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user')
export class UserEntity {

  // constructor(options: {
  //   email: string;
  //   provider: UserProvider;
  //   providerId: string;
  //   name: string;
  //   picture: string;
  // }) {
  //   if (options) {
  //     this.email = options.email;
  //     this.provider = options.provider;
  //     this.providerId = options.providerId;
  //     this.name = options.name;
  //     this.picture = options.picture;
  //   }
  // }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: UserProvider })
  provider: UserProvider;

  @ApiProperty()
  @Column()
  providerId: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  picture: string;

  @Column({ 
    type: String,
    unique: true,
    nullable: true, 
  })
  refreshToken: string | null;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  readonly createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @OneToMany(() => QuestionEntity, question => question.user)
  questions: QuestionEntity[];

  @OneToMany(() => CommentEntity, comments => comments.user)
  comments: CommentEntity[];


  @OneToMany(() => QuestionLikeEntity, questionLike => questionLike.user)
  questionLikes: QuestionLikeEntity[];

  @OneToMany(() => BookmarkEntity, bookmark => bookmark.user)
  bookmarks: BookmarkEntity[];
}