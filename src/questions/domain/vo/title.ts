import { BadRequestException } from "@nestjs/common";
import { InvalidQuestionContent } from "src/common/exception/error-types";
import { Column, Entity } from "typeorm";

const MIN_LENGTH = 2;
const MAX_LENGTH = 50;

@Entity()
export class Title {
  @Column({ nullable: false, type: 'text' })
  private readonly title: string;
  
  constructor(title: string) {
    if (this.isInvalid(title)) {
      throw new BadRequestException(InvalidQuestionContent.message, InvalidQuestionContent.name);
    } 

    this.title = title;
  }

  private isInvalid(title: string): boolean {
    return title.length < MIN_LENGTH || title.length > MAX_LENGTH;
  }

  public getTitle(): string {
    return this.title;
  }
}