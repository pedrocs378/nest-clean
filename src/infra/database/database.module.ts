import { Module } from '@nestjs/common'

import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/app/repositories/students-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachments-repository'
import { QuestionCommentsRepository } from '@/domain/forum/app/repositories/question-comments-repository'
import { AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository'
import { AnswersRepository } from '@/domain/forum/app/repositories/answers-repository'
import { AttachmentsRepository } from '@/domain/forum/app/repositories/attachments-repository'
import { NotificationsRepository } from '@/domain/notification/app/repositories/notifications-repository'

import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments.repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments.repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions.repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments.repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments.repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers.repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students.repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments.repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications.repository'

import { PrismaService } from './prisma/prisma.service'

@Module({
  providers: [
    PrismaService,
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    { provide: AttachmentsRepository, useClass: PrismaAttachmentsRepository },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    AnswerAttachmentsRepository,
    AnswerCommentsRepository,
    AnswersRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
