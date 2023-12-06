import { ApiProperty } from "@nestjs/swagger";
import { Bookmark } from "src/bookmarks/entity/bookmark.entity";
import { UserProvider } from "src/common/enums/user-provider.enum";
import { QuestionLike } from "src/likes/entity/question-like.entity";
import { Question } from "src/questions/infrastructure/entity/question.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {

  constructor(options: {
    email: string;
    provider: UserProvider;
    providerId: string;
    name: string;
    picture: string;
  }) {
    if (options) {
      this.email = options.email;
      this.provider = options.provider;
      this.providerId = options.providerId;
      this.name = options.name;
      this.picture = options.picture;
    }
  }

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

  @OneToMany(() => Question, question => question.writer)
  questions: Question[];

  @OneToMany(() => QuestionLike, questionLike => questionLike.user)
  questionLikes: QuestionLike[];

  @OneToMany(() => Bookmark, bookmark => bookmark.user)
  bookmarks: Bookmark[];

  public updateRefreshToken(token: string | null): void {
    this.refreshToken = token;
  }

  // public getRefreshToken(): string | null {
  //   return this.refreshToken;
  // }

  public isMatchedRefreshToken(token: string) {
    return this.refreshToken === token;
  }

  // public getId(): number {
  //   return this.id;
  // }

  // public getProviderId(): string {
  //   return this.providerId;
  // }
}