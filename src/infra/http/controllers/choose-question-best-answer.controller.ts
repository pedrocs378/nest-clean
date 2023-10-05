import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/app/use-cases/choose-question-best-answer'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUserId() userId: string,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.chooseQuestionBestAnswer.execute({
      authorId: userId,
      answerId,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
