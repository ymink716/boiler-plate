import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BookmarksRepository } from "../domain/repository/bookmarks.repository";
import { BookmarkEntity } from "./entity/bookmark.entity";
import { Bookmark } from "../domain/bookmark";
import { BookmarkMapper } from "./mapper/bookmark.mapper";

@Injectable()
export class TypeormBookmarksRepository implements BookmarksRepository {
  constructor(
    @InjectRepository(BookmarkEntity)
    private readonly bookmarksRepository: Repository<BookmarkEntity>,
  ) {}

  public async countByUserIdAndQuestionId(userId: number, questionId: number): Promise<number> {
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

  public async save(bookmark: Bookmark): Promise<Bookmark> {
    const savedBookmarkEntity = await this.bookmarksRepository.save(
      BookmarkMapper.toPersistence(bookmark),
    );

    return BookmarkMapper.toDomain(savedBookmarkEntity);
  }

  public async findByUserIdAndQuestionId(userId: number, questionId: number): Promise<Bookmark[]> {
    const bookmarkEntities = await this.bookmarksRepository.find({
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

    return bookmarkEntities.map((bookmarkEntity) => BookmarkMapper.toDomain(bookmarkEntity));
  }

  public async remove(bookmarks: Bookmark[]): Promise<void> {
    const bookmarkEntities = bookmarks.map((bookmark) => BookmarkMapper.toPersistence(bookmark));

    await this.bookmarksRepository.remove(bookmarkEntities);
  }
}