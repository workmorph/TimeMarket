"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface AccessibleDialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  title: string
  description?: React.ReactNode
  hideTitle?: boolean
  children?: React.ReactNode
  footer?: React.ReactNode
}

/**
 * アクセシビリティに準拠したDialogContentコンポーネント
 * 常にDialogTitleを含むことを保証し、必要に応じて視覚的に非表示にすることができます
 */
export const AccessibleDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  AccessibleDialogContentProps
>(({ title, description, hideTitle = false, children, footer, className, ...props }, ref) => (
  <DialogContent ref={ref} className={cn(className)} {...props}>
    <DialogHeader>
      <DialogTitle className={cn(hideTitle && "sr-only")}>{title}</DialogTitle>
      {description && <DialogDescription>{description}</DialogDescription>}
    </DialogHeader>
    {children}
    {footer && <DialogFooter>{footer}</DialogFooter>}
  </DialogContent>
))
AccessibleDialogContent.displayName = "AccessibleDialogContent"

export {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  // 元のDialogContentも再エクスポートして、必要に応じて使用できるようにする
  DialogContent,
  DialogTitle,
}
