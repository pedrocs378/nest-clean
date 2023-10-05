import { Either, failure, success } from '@/core/either'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { NotificationsRepository } from '../repositories/notifications-repository'

import { Notification } from '../../enterprise/entities/notification'

type ReadNotificationUseCaseRequest = {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return failure(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== recipientId) {
      return failure(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return success({ notification })
  }
}
