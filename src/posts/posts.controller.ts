import { Body, Controller, Post, Get, Param, Query, ParseIntPipe, Patch, Delete, HttpCode, HttpStatus, } from '@nestjs/common';  
import { PostsService } from './posts.service'; // posts.service.ts에서 PostService의 설계도 가져옴
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService ) {} 
  //constructor(생성자): 처음 생성될 때 한 번 실행
  // private readonly: 클래스의 멤버 변수가 선언된 이후에는 변경 불가

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string){
    return this.postsService.findAll(userId);
  }
  
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 성공: 204 No Content
  remove(@Param('id', ParseIntPipe) id: number) {
    this.postsService.remove(id);
  }
}
