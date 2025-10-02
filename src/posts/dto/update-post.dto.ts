import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {}
// CreatePostDto에서 규칙 상속받되, 선택사항으로 설정 - 모두 수정하지 않아도 되기 때문

