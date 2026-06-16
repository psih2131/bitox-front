import { getPostViews } from '../../../utils/blogViews'

export default defineEventHandler(async (event) => {
  const postId = getRouterParam(event, 'id')

  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: 'Post id is required' })
  }

  const views = await getPostViews(postId)

  return { views }
})
