import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { DeleteAnswerUseCase } from '@/domain/forum/app/use-cases/delete-answer'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUserId() userId: string, @Param('id') answerId: string) {
    const result = await this.deleteAnswer.execute({
      answerId,
      authorId: userId,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
