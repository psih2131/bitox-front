import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const filePath = join(process.cwd(), '.data', 'blog-views.json')

async function readStore() {
  try {
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  }
  catch {
    return {}
  }
}

async function writeStore(data) {
  await mkdir(join(process.cwd(), '.data'), { recursive: true })
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function getPostViews(postId) {
  const store = await readStore()
  return store[postId] ?? 0
}

export async function incrementPostViews(postId) {
  const store = await readStore()
  store[postId] = (store[postId] ?? 0) + 1
  await writeStore(store)
  return store[postId]
}
