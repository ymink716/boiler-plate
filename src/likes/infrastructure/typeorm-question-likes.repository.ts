import { Injectable } from "@nestjs/common";
import { QuestionLikesRepository } from "../domain/repository/question-likes.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QuestionLikeEntity } from "./entity/question-like.entity";
import { QuestionLike } from "../domain/question.like";
import { QeustionLikeMapper } from "./mapper/question-like.mapper";

@Injectable()
export class TypeormQuestionLikesRepository implements QuestionLikesRepository {
  constructor(
    @InjectRepository(QuestionLikeEntity)
    private readonly questionLikesRepository: Repository<QuestionLikeEntity>,
  ) {}

  async count(userId: number, questionId: number): Promise<number> {
    const questionLikesCount = await this.questionLikesRepository.count({
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

    return questionLikesCount;
  }

  async save(questionLike: QuestionLike): Promise<QuestionLike> {
    const savedQuestionLikeEntity = await this.questionLikesRepository.save(
      QeustionLikeMapper.toPersistence(questionLike),
    );

    return QeustionLikeMapper.toDomain(savedQuestionLikeEntity);
  }

  async findByUserIdAndQeustionId(userId: number, questionId: number): Promise<QuestionLike[]> {
    const questionLikeEntities = await this.questionLikesRepository.find({
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

    return questionLikeEntities.map(
      (questionLikeEntity) => QeustionLikeMapper.toDomain(questionLikeEntity)
    );
  }

  async remove(questionLikes: QuestionLike[]): Promise<void> {
    const questionLikeEntities = questionLikes.map(
      (questiontLike) => QeustionLikeMapper.toPersistence(questiontLike)
    );

    await this.questionLikesRepository.remove(questionLikeEntities);
  }
}