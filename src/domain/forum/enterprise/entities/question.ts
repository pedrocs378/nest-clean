import { differenceInDays } from 'date-fns'

import { Optional } from '@/core/types/optional'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

import { Slug } from './value-objects/slug'
import { QuestionAttachmentList } from './question-attachment-list'

export type QuestionProps = {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID | null
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

type CreateQuestionProps = Optional<
  QuestionProps,
  'createdAt' | 'slug' | 'attachments'
>

export class Question extends AggregateRoot<QuestionProps> {
  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
    if (bestAnswerId && bestAnswerId !== this.props.bestAnswerId) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  get authorId() {
    return this.props.authorId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew() {
    return differenceInDays(new Date(), this.createdAt) <= 3
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get excerpt() {
    return this.content.substring(0, 120).trim().concat('...')
  }

  static create(props: CreateQuestionProps, id?: UniqueEntityID) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
