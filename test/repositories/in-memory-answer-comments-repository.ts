import { PaginationParams, getPageRange } from '@/core/repositories/pagination'

import { AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository'

import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    return answerComment ?? null
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const { start, end } = getPageRange(page)

    const answerComment = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice(start, end)

    return answerComment
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ) {
    const { start, end } = getPageRange(page)
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice(start, end)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()}" does not exist.`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          author: author.name,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })
      })

    return answerComments
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === answerComment.id.toString(),
    )

    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1)
    }
  }
}
