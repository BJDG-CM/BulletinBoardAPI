import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionResponseDto {
  @ApiProperty({ description: '카테고리 ID', example: 1 })
  categoryId: number;

  @ApiProperty({ description: '카테고리 이름', example: 'announcement' })
  categoryName: string;

  @ApiProperty({ description: '구독일' })
  subscribedAt: Date;
}
