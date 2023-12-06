import { BadRequestException } from "@nestjs/common";
import { InvalidCommentContent } from "src/common/exception/error-types";
import { Column } from "typeorm";

const MIN_LENGTH = 2;
const MAX_LENGTH = 255;

export class Content {
  @Column({ nullable: false, type: 'text' })
  content: string;
  
  constructor(text: string) {
    if () {}
    console.log('dddddd');
    console.log(text);
    if (this.isInvalid(text)) {
      throw new BadRequestException(InvalidCommentContent.message, InvalidCommentContent.name);
    } 

    this.content = text;
  }

  private isInvalid(text: string): boolean {
    return text.length < MIN_LENGTH || text.length > MAX_LENGTH;
  }

  public getContent(): string {
    return this.content;
  }
}