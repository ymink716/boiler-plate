import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Max, MaxLength, Min, MinLength } from "class-validator";


export class GetQuestionsDto {
  @ApiProperty({ description: '검색어 (2~10글자 사이)', example: '서울', required: false })
  @IsOptional()
  @MinLength(2)
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
}