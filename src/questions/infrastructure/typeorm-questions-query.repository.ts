import { InjectRepository } from "@nestjs/typeorm";
import { QuestionEntity } from "./entity/question.entity";
import { Like, Repository } from "typeorm";

export class TypeormQuestionsQueryRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}
  
  async findOneById(id: number): Promise<QuestionEntity | null> {
    const questionEntity = await this.questionRepository.findOne({ 
      where: { id },
      relations: ['user', 'comments', 'bookmarks', 'likes'],
      select: {
        id: true,
        title: true,
        content: true,
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
        bookmarks: true,
        likes: true,
      }
    });
  
    if (!questionEntity) {
      return null;
    }
  
    return questionEntity;
  }

  async findOneByIdUsingQueryBuilder(userId: number) {

  }

  async find(search: string, page: number, take: number): Promise<QuestionEntity[]> {
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
      'question.createdAt',
    ])
    .leftJoin('question.likes', 'questionLike')
    .loadRelationCountAndMap('question.likes', 'question.likes')
    .loadRelationCountAndMap('question.comments', 'question.comments')
    .loadRelationCountAndMap('question.bookmarks', 'question.bookmarks');

    if (search) {
      queryBuilder.andWhere('question.title like :title', { title: `%${search}%` })
        .orWhere('question.content like :content', { content: `%${search}%` });
    };

    const questions = await queryBuilder.orderBy('question.createdAt', 'DESC')
      .take(take)
      .skip((page - 1) * take)
      .getMany();

    // const questionsEntity = await this.questionRepository.find({
    //   where: [
    //     { title: Like(`%${search}%`) },
    //     { content: Like(`%${search}%`) },
    //   ],
    //   take,
    //   skip: (page - 1) * take,
    //   relations: ['user', 'comments', 'bookmarks', 'likes'],
    //   select: {
    //     id: true,
    //     title: true,
    //     content: true,
    //     createdAt: true,
    //     user: {
    //       id: true,
    //       nickname: true,
    //     },
    //     comments: {
    //       id: true,
    //       content: true,
    //       user: {
    //         id: true,
    //         nickname: true,
    //       },
    //       likes: true,
    //     },
    //     bookmarks: true,
    //     likes: true,
    //   }
    // });

    return questions;
  }
}