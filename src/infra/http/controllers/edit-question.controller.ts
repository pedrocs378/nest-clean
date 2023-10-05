import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

import { EditQuestionUseCase } from '@/domain/forum/app/use-cases/edit-question'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionBody = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUserId() userId: string,
    @Body(bodyValidationPipe) body: EditQuestionBody,
    @Param('id') questionId: string,
  ) {
    const { title, content, attachments } = body

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentIds: attachments,
      questionId,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
