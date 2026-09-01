"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Confirmation dialog for a destructive action.
 *
 * Same construction as the public mobile filter drawer — ink scrim, Escape to
 * close, body scroll locked while open — so the portal and the site behave the
 * same way when something is modal.
 *
 * Two details that matter for a delete prompt specifically:
 *  · **Cancel takes focus, not Confirm.** A stray Return keypress should not
 *    destroy a record.
 *  · Focus is trapped inside the dialog and returned to whatever opened it, so
 *    tabbing cannot land on the page behind and confirm nothing is reachable
 *    without seeing it.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = "Cancel",
  busy = false,
  error,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;

    opener.current = document.activeElement;
    cancelButton.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;

      const focusable = panel.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href]",
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-5">
      <button
        type="button"
        aria-label={cancelLabel}
        onClick={onCancel}
        className="absolute inset-0 bg-ink/45"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-body"
        className="relative w-full max-w-[440px] rounded-card border border-line bg-paper p-7 shadow-[0_24px_60px_-16px_rgba(26,26,24,0.32)]"
      >
        <h2 id="confirm-title" className="mb-2.5 text-[21px] tracking-[-0.018em]">
          {title}
        </h2>
        <div
          id="confirm-body"
          className="text-[14.5px] leading-[1.6] text-ink-2"
          style={{ textWrap: "pretty" }}
        >
          {body}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-[13.5px] leading-[1.5] text-danger">
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            ref={cancelButton}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex h-11 items-center justify-center rounded-full border border-line px-5 text-[14.5px] text-ink transition-colors duration-150 hover:bg-surface disabled:opacity-40"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex h-11 items-center justify-center rounded-full bg-danger px-5 text-[14.5px] text-paper transition-opacity duration-150 hover:opacity-[0.88] disabled:opacity-40"
          >
            {busy ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
