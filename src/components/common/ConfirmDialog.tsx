import React from "react";
import {
  Dialog,
  AccessibleDialogContent,
} from "@/components/ui/accessible-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  children?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "確認",
  cancelLabel = "キャンセル",
  onConfirm,
  onCancel,
  variant = "default",
  children,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AccessibleDialogContent 
        title={title}
        description={description}
        className="sm:max-w-[425px]"
        footer={
          <div className="flex justify-end gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        }
      >
        {children && <div className="py-4">{children}</div>}
      </AccessibleDialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
