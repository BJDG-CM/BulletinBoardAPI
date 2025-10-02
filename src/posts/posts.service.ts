import { Injectable } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto'

@Injectable()
export class PostsService {
  private posts: PostEntity[] = [
    {
      id: 1,
      userId: 'user-1',
      title: '안녕하세요. 처음 뵙겠습니다.',
      content: '반가워요',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      userId: 'user-1',
      title: '점메추 부탁',
      content: '점심 추천 받아용',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      userId: 'user-2',
      title: '국밥 ㄱ',
      content: 'ㅈㄱㄴ',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  private nextPostId = 4;

  create(createPostDto: CreatePostDto): PostEntity {
    const newPost: PostEntity = { // 새 게시글 객체 생성
      id: this.nextPostId++,
      userId: createPostDto.userId,
      title: createPostDto.title,
      content: createPostDto.content
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.posts.push(newPost);

    return newPost;
  }
  
}
