import { BadRequestException } from "@nestjs/common";
import { InvalidCommentContent } from "src/common/exception/error-types";
import { Column, Entity } from "typeorm";

const MIN_LENGTH = 2;
const MAX_LENGTH = 255;
@Entity()
class Content {
  @Column({ nullable: false, type: 'text' })
  private readonly content: string;
  
  constructor(content: string) {
    if (this.isInvalid(content)) {
      throw new BadRequestException(InvalidCommentContent.message, InvalidCommentContent.name);
    } 

    this.content = content;
  }

  private isInvalid(content: string): boolean {
    return content.length < MIN_LENGTH || content.length > MAX_LENGTH;
  }

  public getContent(): string {
    return this.content;
  }
}

export default Content;