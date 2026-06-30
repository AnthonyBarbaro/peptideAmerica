"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Accessibility, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type TextSize = "normal" | "large" | "larger" | "largest";

type AccessibilityPrefs = {
  textSize: TextSize;
  highContrast: boolean;
  darkMode: boolean;
  grayscale: boolean;
  underlineLinks: boolean;
  highlightControls: boolean;
  readableFont: boolean;
  increasedLineHeight: boolean;
  letterSpacing: boolean;
  alignLeft: boolean;
  hideImages: boolean;
  readingGuide: boolean;
  reduceMotion: boolean;
  widgetHidden: boolean;
  widgetPosition: WidgetPosition | null;
};

type WidgetPosition = {
  x: number;
  y: number;
};

const defaultPrefs: AccessibilityPrefs = {
  textSize: "normal",
  highContrast: false,
  darkMode: false,
  grayscale: false,
  underlineLinks: false,
  highlightControls: false,
  readableFont: false,
  increasedLineHeight: false,
  letterSpacing: false,
  alignLeft: false,
  hideImages: false,
  readingGuide: false,
  reduceMotion: false,
  widgetHidden: false,
  widgetPosition: null,
};

const storageKey = "peptide-america-accessibility";
const textSizes: TextSize[] = ["normal", "large", "larger", "largest"];
const textSizeLabels: Record<TextSize, string> = {
  normal: "Normal",
  large: "Large",
  larger: "Larger",
  largest: "Largest",
};
const widgetSize = 48;
const widgetMargin = 16;

function clampWidgetPosition(position: WidgetPosition): WidgetPosition {
  if (typeof window === "undefined") {
    return position;
  }

  return {
    x: Math.min(
      Math.max(widgetMargin, position.x),
      Math.max(widgetMargin, window.innerWidth - widgetSize - widgetMargin),
    ),
    y: Math.min(
      Math.max(widgetMargin, position.y),
      Math.max(widgetMargin, window.innerHeight - widgetSize - widgetMargin),
    ),
  };
}

function applyPrefs(prefs: AccessibilityPrefs) {
  const root = document.documentElement;
  root.dataset.textSize = prefs.textSize;
  root.dataset.highContrast = String(prefs.highContrast);
  root.dataset.darkMode = String(prefs.darkMode);
  root.dataset.grayscale = String(prefs.grayscale);
  root.dataset.underlineLinks = String(prefs.underlineLinks);
  root.dataset.highlightControls = String(prefs.highlightControls);
  root.dataset.readableFont = String(prefs.readableFont);
  root.dataset.increasedLineHeight = String(prefs.increasedLineHeight);
  root.dataset.letterSpacing = String(prefs.letterSpacing);
  root.dataset.alignLeft = String(prefs.alignLeft);
  root.dataset.hideImages = String(prefs.hideImages);
  root.dataset.readingGuide = String(prefs.readingGuide);
  root.dataset.reduceMotion = String(prefs.reduceMotion);
}

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStateRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    moved: boolean;
  } | null>(null);
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(() => {
    if (typeof window === "undefined") {
      return defaultPrefs;
    }

    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = { ...defaultPrefs, ...JSON.parse(saved) } as AccessibilityPrefs;
        return {
          ...parsed,
          widgetPosition: parsed.widgetPosition
            ? clampWidgetPosition(parsed.widgetPosition)
            : null,
        };
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    return defaultPrefs;
  });

  useEffect(() => {
    applyPrefs(prefs);
    window.localStorage.setItem(storageKey, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    const handleResize = () => {
      setPrefs((current) =>
        current.widgetPosition
          ? { ...current, widgetPosition: clampWidgetPosition(current.widgetPosition) }
          : current,
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleOpenAccessibilityPanel = () => {
      setPrefs((current) => ({ ...current, widgetHidden: false }));
      setOpen(true);
    };

    window.addEventListener("open-accessibility-panel", handleOpenAccessibilityPanel);

    return () => {
      window.removeEventListener("open-accessibility-panel", handleOpenAccessibilityPanel);
    };
  }, []);

  const toggle = (key: keyof Omit<AccessibilityPrefs, "textSize">) => {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  };

  const changeTextSize = (direction: "decrease" | "increase") => {
    setPrefs((current) => {
      const index = textSizes.indexOf(current.textSize);
      const nextIndex =
        direction === "increase"
          ? Math.min(index + 1, textSizes.length - 1)
          : Math.max(index - 1, 0);

      return { ...current, textSize: textSizes[nextIndex] };
    });
  };

  const reset = () => setPrefs(defaultPrefs);
  const textSizeIndex = textSizes.indexOf(prefs.textSize);
  const widgetPosition = prefs.widgetPosition;
  const triggerStyle = widgetPosition
    ? { left: `${widgetPosition.x}px`, top: `${widgetPosition.y}px` }
    : undefined;
  const panelStyle = widgetPosition
    ? {
        left: `${Math.min(widgetPosition.x, Math.max(widgetMargin, typeof window === "undefined" ? widgetPosition.x : window.innerWidth - 448 - widgetMargin))}px`,
        top: `${Math.min(widgetPosition.y + widgetSize + 12, Math.max(widgetMargin, typeof window === "undefined" ? widgetPosition.y + widgetSize + 12 : window.innerHeight - 672 - widgetMargin))}px`,
        bottom: "auto",
      }
    : undefined;

  const handleTriggerPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    dragStateRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTriggerPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const nextPosition = clampWidgetPosition({
      x: event.clientX - dragState.offsetX,
      y: event.clientY - dragState.offsetY,
    });

    if (
      Math.abs(nextPosition.x - (prefs.widgetPosition?.x ?? widgetMargin)) > 3 ||
      Math.abs(nextPosition.y - (prefs.widgetPosition?.y ?? window.innerHeight - widgetSize - widgetMargin)) > 3
    ) {
      dragState.moved = true;
      setDragging(true);
    }

    setPrefs((current) => ({ ...current, widgetPosition: nextPosition }));
  };

  const handleTriggerPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;

    if (dragState?.pointerId === event.pointerId) {
      window.setTimeout(() => setDragging(false), 0);
    }

    dragStateRef.current = null;
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`fixed z-50 h-12 w-12 touch-none place-items-center rounded-full border border-blue-800 bg-blue-950 text-white shadow-lg shadow-blue-950/25 transition hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-950 focus-visible:ring-offset-2 ${
            prefs.widgetHidden ? "hidden" : "inline-grid"
          } ${widgetPosition ? "" : "bottom-4 left-4"}`}
          style={triggerStyle}
          aria-label="Open accessibility options"
          title="Open accessibility options. Drag to reposition."
          onPointerDown={handleTriggerPointerDown}
          onPointerMove={handleTriggerPointerMove}
          onPointerUp={handleTriggerPointerUp}
          onPointerCancel={handleTriggerPointerUp}
          onClick={(event) => {
            if (dragging || dragStateRef.current?.moved) {
              event.preventDefault();
            }
          }}
        >
          <Accessibility aria-hidden="true" size={24} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/30" />
        <Dialog.Content
          className="fixed bottom-20 left-4 z-50 flex max-h-[min(42rem,calc(100dvh-6rem))] w-[min(calc(100vw-2rem),28rem)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-blue-950/20"
          style={panelStyle}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-900">
                Accessibility
              </p>
              <Dialog.Title className="mt-1 text-lg font-black text-slate-950">
                Display options
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs font-medium leading-5 text-slate-600">
                Adjust the site display for easier reading and browsing.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close accessibility panel"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </Dialog.Close>
          </div>
          <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-4">
            <fieldset className="grid gap-2">
              <legend className="text-sm font-bold text-slate-950">Text size</legend>
              <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                <button
                  type="button"
                  disabled={textSizeIndex === 0}
                  aria-label="Decrease text size"
                  className="grid min-h-12 place-items-center bg-white text-blue-950 transition hover:bg-blue-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-blue-950"
                  onClick={() => changeTextSize("decrease")}
                >
                  <Minus aria-hidden="true" size={18} />
                </button>
                <div
                  aria-live="polite"
                  className="grid min-h-12 place-items-center border-x border-slate-200 px-3 text-sm font-black text-slate-950"
                >
                  {textSizeLabels[prefs.textSize]}
                </div>
                <button
                  type="button"
                  disabled={textSizeIndex === textSizes.length - 1}
                  aria-label="Increase text size"
                  className="grid min-h-12 place-items-center bg-white text-blue-950 transition hover:bg-blue-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-blue-950"
                  onClick={() => changeTextSize("increase")}
                >
                  <Plus aria-hidden="true" size={18} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {textSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`min-h-9 rounded-md border px-2 text-xs font-bold ${
                      prefs.textSize === size
                        ? "border-blue-950 bg-blue-950 text-white"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => setPrefs((current) => ({ ...current, textSize: size }))}
                  >
                    {size === "normal" ? "Normal" : size === "largest" ? "Max" : textSizeLabels[size]}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ToggleRow
                label="High contrast"
                checked={prefs.highContrast}
                onClick={() => toggle("highContrast")}
              />
              <ToggleRow
                label="Dark mode"
                checked={prefs.darkMode}
                onClick={() => toggle("darkMode")}
              />
              <ToggleRow
                label="Grayscale"
                checked={prefs.grayscale}
                onClick={() => toggle("grayscale")}
              />
              <ToggleRow
                label="Underline links"
                checked={prefs.underlineLinks}
                onClick={() => toggle("underlineLinks")}
              />
              <ToggleRow
                label="Highlight controls"
                checked={prefs.highlightControls}
                onClick={() => toggle("highlightControls")}
              />
              <ToggleRow
                label="Readable font"
                checked={prefs.readableFont}
                onClick={() => toggle("readableFont")}
              />
              <ToggleRow
                label="Increased line height"
                checked={prefs.increasedLineHeight}
                onClick={() => toggle("increasedLineHeight")}
              />
              <ToggleRow
                label="Letter spacing"
                checked={prefs.letterSpacing}
                onClick={() => toggle("letterSpacing")}
              />
              <ToggleRow
                label="Left-align text"
                checked={prefs.alignLeft}
                onClick={() => toggle("alignLeft")}
              />
              <ToggleRow
                label="Hide images"
                checked={prefs.hideImages}
                onClick={() => toggle("hideImages")}
              />
              <ToggleRow
                label="Reading guide"
                checked={prefs.readingGuide}
                onClick={() => toggle("readingGuide")}
              />
              <ToggleRow
                label="Reduce motion"
                checked={prefs.reduceMotion}
                onClick={() => toggle("reduceMotion")}
              />
            </div>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
                onClick={reset}
              >
                <RotateCcw aria-hidden="true" size={18} />
                Reset
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-900"
                  onClick={() => {
                    setPrefs((current) => ({ ...current, widgetHidden: true }));
                  }}
                >
                  Hide floating button
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
      <div
        aria-hidden="true"
        className="accessibility-reading-guide pointer-events-none fixed left-0 top-[45vh] z-40 hidden h-12 w-screen border-y-2 border-blue-800/50 bg-blue-300/20"
      />
    </Dialog.Root>
  );
}

function ToggleRow({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick(): void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="flex min-h-12 items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-left transition hover:bg-slate-50"
      onClick={onClick}
    >
      <span className="text-sm font-bold text-slate-800">{label}</span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-950" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}
