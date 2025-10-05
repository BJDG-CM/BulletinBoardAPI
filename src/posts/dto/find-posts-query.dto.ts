import { IsOptional, IsString } from 'class-validator';

export class FindPostsQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;
}