import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CommentOnQuestionUseCase } from '@/domain/forum/app/use-cases/comment-on-question'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

type CommentOnQuestionBody = z.infer<typeof commentOnQuestionBodySchema>

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUserId() userId: string,
    @Body(bodyValidationPipe) body: CommentOnQuestionBody,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
