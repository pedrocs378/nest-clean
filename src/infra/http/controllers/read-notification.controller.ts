import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

import { ReadNotificationUseCase } from '@/domain/notification/app/use-cases/read-notification'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('notificationId') notificationId: string,
    @CurrentUserId() userId: string,
  ) {
    const result = await this.readNotification.execute({
      notificationId,
      recipientId: userId,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
