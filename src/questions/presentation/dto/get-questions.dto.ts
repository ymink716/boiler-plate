import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, MaxLength, Min } from "class-validator";


export class GetQuestionsDto {
  @ApiProperty({ description: '검색어', example: '서울', nullable: true })
  @IsOptional()
  @MaxLength(50)
  search: string;

  @ApiProperty({ description: '페이지', example: 1, default: 1 })
  @Min(1)
  page: number;

  @ApiProperty({ description: '개수 (1~50 사이)', example: 10, default: 10 })
  @Min(1)
  @Max(50)
  take: number;
}