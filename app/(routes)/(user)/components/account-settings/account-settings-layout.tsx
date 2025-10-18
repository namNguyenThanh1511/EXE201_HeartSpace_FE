"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AccountSettingsLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function AccountSettingsLayout({
  children,
  title,
  description,
  isLoading,
  error,
  onRetry,
}: AccountSettingsLayoutProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Lỗi tải dữ liệu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Không thể tải thông tin cài đặt. Vui lòng thử lại.
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Thử lại
                </button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <motion.div
        className="max-w-screen-2xl mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border-0 bg-background/95 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
            {description && (
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            )}
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
