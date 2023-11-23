import { BadRequestException } from "@nestjs/common";
import { InvalidCommentContent } from "src/common/exception/error-types";
import { Column, Entity } from "typeorm";


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
    return content.length < 2 || content.length > 255;
  }

  public getContent(): string {
    return this.content;
  }
}

export default Content;