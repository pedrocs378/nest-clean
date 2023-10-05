import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { AnswerQuestionUseCase } from '@/domain/forum/app/use-cases/answer-question'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUserId() userId: string,
    @Body(bodyValidationPipe) body: AnswerQuestionBody,
    @Param('questionId') questionId: string,
  ) {
    const { content, attachments } = body

    const result = await this.answerQuestion.execute({
      content,
      questionId,
      authorId: userId,
      attachmentIds: attachments,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
