import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

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
    const newPost: PostEntity = { // 새 게시물 작성
      id: this.nextPostId++,
      ...createPostDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as PostEntity;

    this.posts.push(newPost);

    return newPost;
  }

  findAll(userId?: string): PostEntity[] {
    if(userId){
      return this.posts.filter((post) => post.userId === userId); //userId에 해당하는 게시글 필터링
    }
    else{
      return this.posts; // 없으면 전체 목록 반환
    }
  }

  findOneById(id:number): PostEntity {
    const post = this.posts.find((post) => post.id === id);

    if(!post){
      throw new NotFoundException('Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.');
    }

    return post;
  }
  
  update(id: number, updatePostDto: UpdatePostDto): PostEntity {
    const postIndex = this.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      throw new NotFoundException('Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.');
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updatePostDto,
      updatedAt: new Date()
    };

    return this.posts[postIndex];
  }

  remove(id: number): void {
    const postIndex = this.posts.findIndex((p) => p.id === id);
    if (postIndex === -1){
      throw new NotFoundException('Error!: 게시글 ID가 "${id}"인 게시글을 찾을 수 없습니다.')
    }
    this.posts.splice(postIndex, 1);
  }
}
