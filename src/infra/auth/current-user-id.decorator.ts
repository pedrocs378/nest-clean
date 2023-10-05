import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

import { UserPayload } from './jwt.strategy'

export const CurrentUserId = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>()

    const payload = request.user as UserPayload

    return payload.sub
  },
)
