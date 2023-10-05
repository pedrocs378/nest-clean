import { StudentsRepository } from '@/domain/forum/app/repositories/students-repository'

import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((item) => item.email.toString() === email)

    return student ?? null
  }

  async create(student: Student) {
    this.items.push(student)
  }
}
