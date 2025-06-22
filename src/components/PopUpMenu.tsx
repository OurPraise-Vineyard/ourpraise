import classNames from 'classnames'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

const contextMenuWidth = 160
const contextMenuItemHeight = 40

type PopUpItemsType = {
  label: string
  onClick: React.MouseEventHandler
  danger?: boolean
}[]

type PopUpMenuContextType = {
  open: (
    e: React.MouseEvent<HTMLElement>,
    getItems: () => PopUpItemsType
  ) => void
  close: () => void
}

const PopUpMenuContext = createContext<PopUpMenuContextType>({
  open: () => {},
  close: () => {}
})

export const usePopUpMenu = () => useContext(PopUpMenuContext)

export default function PopUpMenuProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [menuItems, setMenuItems] = useState<PopUpItemsType>([])

  const open = useCallback(
    (e: React.MouseEvent<HTMLElement>, getItems: () => PopUpItemsType) => {
      const items = getItems()
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
        e.currentTarget
      const contextMenuHeight = contextMenuItemHeight * items.length
      const left = Math.max(
        0,
        Math.min(
          window.innerWidth - contextMenuWidth,
          offsetLeft + offsetWidth - contextMenuWidth
        )
      )
      const top = Math.max(
        0,
        Math.min(
          window.innerHeight - contextMenuHeight,
          offsetTop + offsetHeight - window.scrollY + 5 // Add 5px to the top to make it look better
        )
      )
      setPosition({ top, left })
      setMenuItems(getItems())
      setShow(true)
    },
    [
      setPosition,
      setMenuItems,
      setShow,
      window.innerWidth,
      window.innerHeight,
      window.scrollY
    ]
  )

  const close = useCallback(() => setShow(false), [setShow])

  useEffect(() => {
    window.addEventListener('scroll', close)
    return () => window.removeEventListener('scroll', close)
  }, [close])

  return (
    <>
      <PopUpMenuContext.Provider value={{ open, close }}>
        {children}
      </PopUpMenuContext.Provider>
      <div
        className={classNames(
          'fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/10 transition-opacity duration-200 ease-out',
          { 'pointer-events-none opacity-0': !show },
          { 'pointer-events-auto opacity-100': show }
        )}
        onClick={close}
      />
      <div
        className={classNames(
          'transition-translate-opacity fixed z-30 flex w-40 flex-col overflow-hidden rounded-md shadow-md duration-200 ease-out',
          !show && 'pointer-events-none translate-y-5 scale-x-95 opacity-0',
          show && 'pointer-events-auto translate-y-0 scale-x-100 opacity-100'
        )}
        style={{
          top: position.top,
          left: position.left
        }}
      >
        {menuItems.map((item, index) => (
          <button
            className={classNames(
              'h-10 cursor-pointer border-b border-b-gray-300 bg-white px-5 transition-colors duration-200 ease-out last:border-none hover:bg-gray-100',
              item.danger && 'text-red-500'
            )}
            onClick={e => {
              item.onClick(e)
              close()
            }}
            key={index}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  )
}
