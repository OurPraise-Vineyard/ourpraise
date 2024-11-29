export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-page max-w-full animate-fadeIn p-5">
      {children}
    </div>
  )
}
