export function formatLink(
  pathname: string,
  searchParams: Record<string, string | null>
) {
  const params = Object.entries(searchParams)
    .filter(([, value]) => !!value)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
    )
    .join('&')

  return params ? `${pathname}?${params}` : pathname
}
