import { BadRequestException } from "@nestjs/common";
import { InvalidQuestionContent } from "src/common/exception/error-types";
import { Column, Entity } from "typeorm";

@Entity()
export class Content {
  @Column({ nullable: false, type: 'text' })
  private readonly content: string;
  
  constructor(content: string) {
    if (this.isInvalid(content)) {
      throw new BadRequestException(InvalidQuestionContent.message, InvalidQuestionContent.name);
    } 

    this.content = content;
  }

  private isInvalid(content: string): boolean {
    return content.length < 2 || content.length > 500;
  }

  public getContent(): string {
    return this.content;
  }
}