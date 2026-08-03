"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DataErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function DataError({
  message = "Terjadi kesalahan saat memuat data.",
  onRetry,
}: DataErrorProps) {
  return (
    <div className="w-full p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <span>{message}</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={onRetry}
            >
              Coba Lagi
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
