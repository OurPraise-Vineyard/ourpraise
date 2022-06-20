import { AppDispatch, RootState } from '@store'
import { useEffect } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function useDocumentTitle (title: string) {
  useEffect(() => {
    document.title = `${title} - OurPraise`
  }, [title])
}
