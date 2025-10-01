import { Controller } from '@nestjs/common';  
import { PostsService } from './posts.service'; // posts.service.ts에서 PostService의 설계도 가져옴

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService ) {} 
  //constructor(생성자): 처음 생성될 때 한 번 실행
  // private readonly: 클래스의 멤버 변수가 선언된 이후에는 변경 불가
}
