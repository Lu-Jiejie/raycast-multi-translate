import { useCachedState } from '@raycast/utils'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function formatAxiosError(error: unknown): string {
  if (isAxiosError(error) && error.response) {
    return JSON.stringify(error.response.data)
  }
  return JSON.stringify(error)
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
