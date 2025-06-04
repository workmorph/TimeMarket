"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetOverlay,
  SheetPortal,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface AccessibleSheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetContent> {
  title: string
  description?: React.ReactNode
  hideTitle?: boolean
  children?: React.ReactNode
  footer?: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

/**
 * アクセシビリティに準拠したSheetContentコンポーネント
 * SheetTitleを必ず含むようにして、Radix UIのアクセシビリティ警告を防止します
 */
export const AccessibleSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  AccessibleSheetContentProps
>(({ title, description, hideTitle = false, children, footer, className, side = "right", ...props }, ref) => (
  <SheetContent ref={ref} side={side} className={cn(className)} {...props}>
    <SheetHeader>
      <SheetTitle className={cn(hideTitle && "sr-only")}>{title}</SheetTitle>
      {description && <SheetDescription>{description}</SheetDescription>}
    </SheetHeader>
    {children}
    {footer && <SheetFooter>{footer}</SheetFooter>}
  </SheetContent>
))
AccessibleSheetContent.displayName = "AccessibleSheetContent"

// 他のコンポーネントを再エクスポート
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  // 元のSheetContentも再エクスポートして、必要に応じて使用できるようにする
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
