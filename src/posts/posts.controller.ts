import { Body, Controller, Post, Get, Param, Query, Patch, Delete, HttpCode, HttpStatus, UseGuards, Request, ParseIntPipe } from '@nestjs/common';  
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiParam, ApiQuery, ApiNoContentResponse, ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 생성' })
  @ApiCreatedResponse({ description: '게시글 생성 성공!', type: PostResponseDto })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  async create(@Body() createPostDto: CreatePostDto, @Request() req): Promise<ApiResponseDto<PostResponseDto>> {
    const post = await this.postsService.create(createPostDto, req.user.userId);
    return ApiResponseDto.success(post);
  }

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiQuery({ type: FindPostsQueryDto })
  @ApiOkResponse({ description: '목록 조회 성공!', type: [PostResponseDto] })
  async findAll(@Query() query: FindPostsQueryDto): Promise<ApiResponseDto<PostResponseDto[]>> {
    const posts = await this.postsService.findAll(query.userId);
    return ApiResponseDto.success(posts);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 게시글 상세 조회' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiOkResponse({ description: '상세 조회 성공!', type: PostResponseDto })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<PostResponseDto>> {
    const post = await this.postsService.findOneById(id);
    return ApiResponseDto.success(post);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 게시글 수정' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiOkResponse({ description: '게시글 수정 성공!', type: PostResponseDto })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  @ApiForbiddenResponse({ description: '권한 없음 (작성자만 수정 가능)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ): Promise<ApiResponseDto<PostResponseDto>> {
    const post = await this.postsService.update(id, updatePostDto, req.user.userId);
    return ApiResponseDto.success(post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 게시글 삭제' })
  @ApiParam({ name: 'id', description: '게시글 ID', example: 1 })
  @ApiNoContentResponse({ description: '게시글 삭제 성공!' })
  @ApiNotFoundResponse({ description: '게시글을 찾을 수 없음' })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  @ApiForbiddenResponse({ description: '권한 없음 (작성자만 삭제 가능)' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    await this.postsService.remove(id, req.user.userId);
  }
}