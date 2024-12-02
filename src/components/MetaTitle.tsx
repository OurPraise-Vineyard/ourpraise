import { useEffect } from 'react'

export default function MetaTitle({ title }: { title: string }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} - OurPraise`
    } else {
      document.title = 'OurPraise'
    }
  }, [title])

  return null
}
