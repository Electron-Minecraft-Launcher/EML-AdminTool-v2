import { db } from '$lib/server/db'
import { getNews } from '$lib/server/news'
import type { RequestHandler } from './$types'
import { error, json } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
  let news

  try {
    news = await getNews()
  } catch (err) {
    console.error('Failed to get news:', err)
    return json({ success: false, message: 'Failed to get news' }, { status: 500 })
  }

  const res = {
    success: true,
    news
  }

  return json(res)
}

