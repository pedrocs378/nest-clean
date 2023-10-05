import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams, getPageRange } from '@/core/repositories/pagination'

import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/app/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    return answer ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const { start, end } = getPageRange(page)

    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice(start, end)

    return answers
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === answer.id.toValue(),
    )

    if (itemIndex > -1) {
      this.items[itemIndex] = answer

      await this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      )

      await this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      )

      DomainEvents.dispatchEventsForAggregate(answer.id)
    }
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === answer.id.toValue(),
    )

    this.items.splice(itemIndex, 1)

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
