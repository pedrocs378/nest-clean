import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { DeleteQuestionUseCase } from '@/domain/forum/app/use-cases/delete-question'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUserId() userId: string,
    @Param('id') questionId: string,
  ) {
    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
