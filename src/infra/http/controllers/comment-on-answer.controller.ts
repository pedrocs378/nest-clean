import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CommentOnAnswerUseCase } from '@/domain/forum/app/use-cases/comment-on-answer'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

type CommentOnAnswerBody = z.infer<typeof commentOnAnswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @CurrentUserId() userId: string,
    @Body(bodyValidationPipe) body: CommentOnAnswerBody,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: userId,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
