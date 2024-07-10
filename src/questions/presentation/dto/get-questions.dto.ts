import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, Max, MaxLength, Min, MinLength } from "class-validator";
import { QuestionsSortCondition } from "src/common/enums/questions-sort-condition.enum";


export class GetQuestionsDto {
  @ApiProperty({ description: '검색어 (1~10글자 사이)', example: '서울', required: false })
  @IsOptional()
  @MinLength(1)
  @MaxLength(10)
  search: string;

  @ApiProperty({ description: '페이지 (1 이상)', example: 1, required: false })
  @IsOptional()
  @Min(1)
  page: number;

  @ApiProperty({ description: '개수 (10~50 사이)', example: 10, required: false })
  @IsOptional()
  @Min(10)
  @Max(50)
  take: number;

  @ApiProperty({ description: '정렬 조건 LATEST | VIEWS (최신순 | 조회순)', example: 'LATEST', required: false})
  @IsOptional()
  sort: QuestionsSortCondition;
}