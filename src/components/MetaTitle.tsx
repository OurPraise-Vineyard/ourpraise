import { useEffect } from 'react'

export default function MetaTitle({ children: title }: { children: string }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} - OurPraise`
    } else {
      document.title = 'OurPraise'
    }
  }, [title])

  return null
}
