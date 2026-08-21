"use client";

import type { ReactNode } from "react";
import type { FieldError } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  required?: boolean;
  error?: FieldError;
  children: ReactNode;
  className?: string;
  hint?: string;
}

export function FieldWrapper({
  label,
  required = false,
  error,
  children,
  className,
  hint,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  id: string;
  value: string;
  onChange(value: string): void;
  onBlur?(): void;
  placeholder?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
  maxLength?: number;
  required?: boolean;
}

export function TextField({
  label,
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  hint,
  className,
  disabled = false,
  maxLength,
  required = false,
}: TextFieldProps) {
  return (
    <FieldWrapper
      label={label}
      required={required}
      hint={hint}
      className={className}
    >
      <Input
        id={id}
        value={value}
        required={required}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="rounded-lg text-sm"
      />
    </FieldWrapper>
  );
}
