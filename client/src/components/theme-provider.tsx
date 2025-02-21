"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextThemes } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useNextThemes()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }, [resolvedTheme, setTheme])

  return {
    theme: mounted ? resolvedTheme : undefined,
    toggleTheme,
    mounted
  }
}