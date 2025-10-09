import { Body, Controller, Post, Get, Param, Query, Patch, Delete, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';  
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { FindPostParamDto } from './dto/find-post-param.dto';
import { PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Request() req): Promise<PostEntity> {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  async findAll(@Query() query: FindPostsQueryDto): Promise<PostEntity[]> {
    return this.postsService.findAll(query.userId);
  }

  @Get(':id')
  async findOne(@Param() params: FindPostParamDto): Promise<PostEntity> {
    return this.postsService.findOneById(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param() params: FindPostParamDto,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ): Promise<PostEntity> {
    return this.postsService.update(params.id, updatePostDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() params: FindPostParamDto, @Request() req): Promise<void> {
    return this.postsService.remove(params.id, req.user.userId);
  }
}