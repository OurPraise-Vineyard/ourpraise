import { AppDispatch, RootState } from '@state/store'
import { useEffect } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = `${title} - OurPraise`
    } else {
      document.title = 'OurPraise'
    }
  }, [title])
}
