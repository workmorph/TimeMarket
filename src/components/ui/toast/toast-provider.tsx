"use client"

import * as React from "react"
import { ToastProvider as RadixToastProvider } from "@radix-ui/react-toast"
import { ToastViewport } from "./toast"

export interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <RadixToastProvider>
      {children}
      <ToastViewport />
    </RadixToastProvider>
  )
}
