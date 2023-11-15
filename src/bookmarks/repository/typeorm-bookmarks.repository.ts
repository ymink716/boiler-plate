import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookmarksRepository } from "./bookmarks.repository";
import { Bookmark } from "../entity/bookmark.entity";

@Injectable()
export class TypeormBookmarksRepository implements BookmarksRepository {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarksRepository: Repository<Bookmark>,
  ) {}

  async countByUserIdAndQuestionId(userId: number, questionId: number): Promise<number> {
    const bookmarksCount = await this.bookmarksRepository.count({
      relations: {
        user: true,
        question: true,
      },      
      where: {
        user: {
          id: userId,
        },
        question: {
          id: questionId,
        }
      },
    });

    return bookmarksCount;
  }

  async save(bookmark: Bookmark): Promise<Bookmark> {
    return await this.bookmarksRepository.save(bookmark);
  }

  async findByUserIdAndQuestionId(userId: number, questionId: number): Promise<Bookmark[]> {
    const commentLikes = await this.bookmarksRepository.find({
      relations: {
        user: true,
        question: true,
      },      
      where: {
        user: {
          id: userId,
        },
        question: {
          id: questionId,
        }
      },
    });

    return commentLikes;
  }

  async delete(bookmarkId: number): Promise<void> {
    await this.bookmarksRepository.delete(bookmarkId);
  }
}