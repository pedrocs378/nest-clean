import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'

import { Attachment } from '../../enterprise/entities/attachment'

import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../../storage/uploader'

import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'

type UploadAndCreateAttachmentUseCaseRequest = {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment
  }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    const fileTypeRegex = /^(image\/(png|jpe?g)|application\/pdf)$/

    if (!fileTypeRegex.test(fileType)) {
      return failure(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ body, fileName, fileType })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return success({ attachment })
  }
}
