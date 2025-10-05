import { Body, Controller, Post, Get, Param, Query, Patch, Delete, HttpCode, HttpStatus, ParseIntPipe, } from '@nestjs/common';  
import { PostsService } from './posts.service'; // posts.service.ts에서 PostService의 설계도 가져옴
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { FindPostParamDto } from './dto/find-post-param.dto';
import { PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(@Query() query: FindPostsQueryDto): Promise<PostEntity[]> {
    return this.postsService.findAll(query.userId);
  }

  @Get(':id')
  async findOne(@Param() params: FindPostParamDto): Promise<PostEntity> {
    return this.postsService.findOneById(params.id);
  }

  @Patch(':id')
  async update(
    @Param() params: FindPostParamDto,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(params.id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: FindPostParamDto): Promise<void> {
    return this.postsService.remove(params.id);
  }
}