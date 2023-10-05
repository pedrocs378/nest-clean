import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

import { CreateQuestionUseCase } from '@/domain/forum/app/use-cases/create-question'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUserId() userId: string,
    @Body(bodyValidationPipe) body: CreateQuestionBody,
  ) {
    const { title, content, attachments } = body

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentIds: attachments,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
