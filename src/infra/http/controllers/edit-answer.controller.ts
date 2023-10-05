import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

import { EditAnswerUseCase } from '@/domain/forum/app/use-cases/edit-answer'

import { CurrentUserId } from '@/infra/auth/current-user-id.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

type EditAnswerBody = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUserId() userId: string,
    @Body(bodyValidationPipe) body: EditAnswerBody,
    @Param('id') answerId: string,
  ) {
    const { content, attachments } = body

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentIds: attachments,
      answerId,
    })

    if (result.isFailure()) {
      throw new BadRequestException()
    }
  }
}
