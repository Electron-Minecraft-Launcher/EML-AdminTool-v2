import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { NotificationCode } from '$lib/utils/notifications'
import { update } from '$lib/server/update'

export const GET: RequestHandler = async (event) => {
  const user = event.locals.user

  if (!user?.isAdmin) {
    return error(403, { message: NotificationCode.FORBIDDEN })
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      const push = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      update(controller, push)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}

