import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '카테고리 추가' })
  @ApiResponse({ status: 201, description: '카테고리 생성', type: CategoryResponseDto })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ApiResponseDto<CategoryResponseDto>> {
    const category = await this.categoriesService.create(createCategoryDto);
    return ApiResponseDto.success(category);
  }

  @Get()
  @ApiOperation({ summary: '카테고리 목록 조회' })
  @ApiResponse({ status: 200, description: '카테고리 목록', type: [CategoryResponseDto] })
  async findAll(): Promise<ApiResponseDto<CategoryResponseDto[]>> {
    const categories = await this.categoriesService.findAll();
    return ApiResponseDto.success(categories);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '카테고리 삭제' })
  @ApiResponse({ status: 200, description: '카테고리 삭제 성공' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<{ message: string }>> {
    await this.categoriesService.remove(id);
    return ApiResponseDto.success({ message: '카테고리가 삭제되었습니다.' });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/subscribe')
  @ApiBearerAuth()
  @ApiOperation({ summary: '카테고리 구독' })
  @ApiResponse({ status: 201, description: '구독 성공', type: SubscriptionResponseDto })
  async subscribe(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<ApiResponseDto<SubscriptionResponseDto>> {
    const subscription = await this.categoriesService.subscribe(req.user.userId, id);
    return ApiResponseDto.success({
      categoryId: subscription.categoryId,
      categoryName: subscription.category.name,
      subscribedAt: subscription.createdAt,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/subscribe')
  @ApiBearerAuth()
  @ApiOperation({ summary: '카테고리 구독 취소' })
  @ApiResponse({ status: 200, description: '구독 취소 성공' })
  async unsubscribe(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<ApiResponseDto<{ message: string }>> {
    await this.categoriesService.unsubscribe(req.user.userId, id);
    return ApiResponseDto.success({ message: '구독이 취소되었습니다.' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscriptions/me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 구독 목록 조회' })
  @ApiResponse({ status: 200, description: '구독 목록', type: [SubscriptionResponseDto] })
  async mySubscriptions(@Request() req): Promise<ApiResponseDto<SubscriptionResponseDto[]>> {
    const subscriptions = await this.categoriesService.findSubscriptions(req.user.userId);
    return ApiResponseDto.success(
      subscriptions.map((subscription) => ({
        categoryId: subscription.categoryId,
        categoryName: subscription.category.name,
        subscribedAt: subscription.createdAt,
      })),
    );
  }
}
