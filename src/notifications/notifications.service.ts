import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { EMPTY, from, of } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

interface PushResultData {
  message: string;
  deviceId: string;
}

interface PushResponse {
  resultCode: number;
  resultData?: PushResultData;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly pushEndpoint: string;

  constructor(private readonly prisma: PrismaService, configService: ConfigService) {
    this.pushEndpoint = configService.get<string>('PUSH_SERVER_URL') ?? 'http://localhost:8090/api/push';
  }

  notifyCategorySubscribers(categoryId: number) {
    from(this.getSubscriberIds(categoryId))
      .pipe(
        switchMap((subscriberIds) => from(subscriberIds)),
        mergeMap((subscriberId) => this.sendPush(subscriberId), 5),
        catchError((error) => {
          this.logger.error(`Unexpected error while dispatching notifications for category ${categoryId}`, error);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private async getSubscriberIds(categoryId: number): Promise<string[]> {
    const subscriptions = await this.prisma.userCategory.findMany({
      where: { categoryId },
      select: { userId: true },
    });

    return subscriptions.map((subscription) => subscription.userId);
  }

  private sendPush(userId: string) {
    const deviceId = randomUUID();

    return from(
      fetch(this.pushEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      }),
    ).pipe(
      mergeMap(async (response) => {
        let payload: PushResponse | null = null;
        try {
          payload = (await response.json()) as PushResponse;
        } catch (error) {
          this.logger.warn(`Push server response for user ${userId} with deviceId ${deviceId} could not be parsed.`);
        }
        return { response, payload };
      }),
      tap(({ response, payload }) => {
        if (!response.ok) {
          this.logger.warn(`Push request for user ${userId} failed with status ${response.status}.`);
          return;
        }

        const resultCode = payload?.resultCode;
        const returnedDeviceId = payload?.resultData?.deviceId ?? deviceId;

        if (resultCode !== 100) {
          this.logger.warn(
            `Push server returned failure for user ${userId}. code=${resultCode}, deviceId=${returnedDeviceId}`,
          );
          return;
        }

        this.logger.log(`Push sent for user ${userId} with deviceId=${returnedDeviceId}`);
      }),
      catchError((error) => {
        this.logger.error(`Failed to send push for user ${userId} with deviceId ${deviceId}`, error);
        return of(null);
      }),
    );
  }
}