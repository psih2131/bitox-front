export function usePostViews(postId) {
  const { data, refresh } = useFetch(
    () => (postId.value ? `/api/blog/views/${postId.value}` : null),
    { watch: [postId] },
  )

  const views = computed(() => data.value?.views ?? 0)

  onMounted(async () => {
    if (!postId.value) return

    const storageKey = `blog-view-${postId.value}`

    if (sessionStorage.getItem(storageKey)) return

    try {
      await $fetch(`/api/blog/views/${postId.value}`, { method: 'POST' })
      sessionStorage.setItem(storageKey, '1')
      await refresh()
    }
    catch {
      // ignore
    }
  })

  return { views }
}
