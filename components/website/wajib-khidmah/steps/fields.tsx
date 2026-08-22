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
  /** id kontrol yang di-label agar asosiasi label–input programatik valid. */
  htmlFor?: string;
}

export function FieldWrapper({
  label,
  required = false,
  error,
  children,
  className,
  hint,
  htmlFor,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-sm font-medium" htmlFor={htmlFor}>
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
  type?: "text" | "tel" | "email" | "url" | "number";
  inputMode?: "text" | "tel" | "numeric" | "decimal";
  autoComplete?: string;
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
  type = "text",
  inputMode,
  autoComplete,
}: TextFieldProps) {
  return (
    <FieldWrapper
      label={label}
      required={required}
      hint={hint}
      className={className}
      htmlFor={id}
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
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="rounded-lg text-sm"
      />
    </FieldWrapper>
  );
}
