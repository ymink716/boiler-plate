import { InjectRepository } from "@nestjs/typeorm";
import { QuestionEntity } from "./entity/question.entity";
import { Repository } from "typeorm";
import { QuestionsSortCondition } from "src/common/enums/questions-sort-condition.enum";

export class TypeormQuestionsQueryRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}
  
  async findOneById(id: number): Promise<QuestionEntity | null> {
    const questionEntity = await this.questionRepository.findOne({ 
      where: { id },
      relations: ['user', 'comments', 'bookmarks', 'comments.user', 'bookmarks.user'],
      select: {
        id: true,
        title: true,
        content: true,
        views: true,
        createdAt: true,
        user: {
          id: true,
          nickname: true,
        },
        comments: {
          id: true,
          content: true,
          user: {
            id: true,
            nickname: true,
          },
          likes: true,
        },
        bookmarks: {
          id: true,
          user: {
            id: true,
          }
        }
      }
    });
  
    if (!questionEntity) {
      return null;
    }

    return questionEntity;
  }

  async find(
    search: string, page: number, take: number, sort: QuestionsSortCondition
  ): Promise<QuestionEntity[]> {
    if (page === undefined) {
      page = 1;
    }

    if (take === undefined) {
      take = 10;
    }

    const queryBuilder = this.questionRepository
    .createQueryBuilder('question')
    .select([
      'question.id',
      'question.title',
      'question.views',
      'question.createdAt',
    ])
    .loadRelationCountAndMap('question.comments', 'question.comments')
    .loadRelationCountAndMap('question.bookmarks', 'question.bookmarks');

    if (search) {
      queryBuilder.andWhere('question.title like :title', { title: `%${search}%` })
        .orWhere('question.content like :content', { content: `%${search}%` });
    };

    let questions;

    if (sort === QuestionsSortCondition.LATEST || sort === undefined) {
      questions = await queryBuilder.orderBy('question.createdAt', 'DESC')
      .take(take)
      .skip((page - 1) * take)
      .getMany();
    } else if (sort === QuestionsSortCondition.VIEWS) {
      questions = await queryBuilder.orderBy('question.views', 'DESC')
      .take(take)
      .skip((page - 1) * take)
      .getMany();
    }

    return questions;
  }

  public async findByUser(userId: number) {
    const questions = this.questionRepository
      .createQueryBuilder('question')
      .select([
        'question.id',
        'question.title',
        'question.views',
        'question.createdAt',
      ])
      .loadRelationCountAndMap('question.comments', 'question.comments')
      .loadRelationCountAndMap('question.bookmarks', 'question.bookmarks')
      .leftJoin('question.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('question.createdAt', 'DESC')
      .getMany();

    return questions;
  }

  public async findByBookmarks(userId: number) {
    const questions = this.questionRepository
      .createQueryBuilder('question')
      .select([
        'question.id',
        'question.title',
        'question.views',
        'question.createdAt',
      ])
      .loadRelationCountAndMap('question.comments', 'question.comments')
      .loadRelationCountAndMap('question.bookmarks', 'question.bookmarks')
      .leftJoin('question.bookmarks', 'bookmark')
      .leftJoin('bookmark.user', 'bookmarkedUser')
      .where('bookmarkedUser.id = :userId', { userId })
      .orderBy('question.createdAt', 'DESC')
      .getMany();

    return questions;
  }
}