"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { RotateCcw, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

type TextSize = "normal" | "large" | "xlarge";

type AccessibilityPrefs = {
  textSize: TextSize;
  readableFont: boolean;
  increasedLineHeight: boolean;
  highContrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  enhancedFocus: boolean;
};

const defaultPrefs: AccessibilityPrefs = {
  textSize: "normal",
  readableFont: false,
  increasedLineHeight: false,
  highContrast: false,
  underlineLinks: false,
  reduceMotion: false,
  enhancedFocus: false,
};

const storageKey = "peptide-america-accessibility";

function applyPrefs(prefs: AccessibilityPrefs) {
  const root = document.documentElement;
  root.dataset.textSize = prefs.textSize;
  root.dataset.readableFont = String(prefs.readableFont);
  root.dataset.increasedLineHeight = String(prefs.increasedLineHeight);
  root.dataset.highContrast = String(prefs.highContrast);
  root.dataset.underlineLinks = String(prefs.underlineLinks);
  root.dataset.reduceMotion = String(prefs.reduceMotion);
  root.dataset.enhancedFocus = String(prefs.enhancedFocus);
}

export function AccessibilityPanel() {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(() => {
    if (typeof window === "undefined") {
      return defaultPrefs;
    }

    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      try {
        return { ...defaultPrefs, ...JSON.parse(saved) } as AccessibilityPrefs;
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

  const toggle = (key: keyof Omit<AccessibilityPrefs, "textSize">) => {
    setPrefs((current) => ({ ...current, [key]: !current[key] }));
  };

  const reset = () => setPrefs(defaultPrefs);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed bottom-4 right-4 z-50 inline-flex min-h-12 items-center gap-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-slate-950/30 transition hover:bg-red-500"
        >
          <Settings2 aria-hidden="true" size={18} />
          Accessibility
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed bottom-4 right-4 z-50 max-h-[calc(100vh-2rem)] w-[min(calc(100vw-2rem),28rem)] overflow-auto rounded-lg border border-slate-200 bg-white p-5 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold text-slate-950">
              Accessibility
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close accessibility panel"
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </Dialog.Close>
          </div>
          <div className="mt-5 grid gap-5">
            <fieldset>
              <legend className="text-sm font-semibold text-slate-900">Text size</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["normal", "large", "xlarge"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`min-h-10 rounded-md border px-3 text-sm font-semibold ${
                      prefs.textSize === size
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                    onClick={() => setPrefs((current) => ({ ...current, textSize: size }))}
                  >
                    {size === "xlarge" ? "XL" : size[0].toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-2">
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
                label="High contrast"
                checked={prefs.highContrast}
                onClick={() => toggle("highContrast")}
              />
              <ToggleRow
                label="Underline links"
                checked={prefs.underlineLinks}
                onClick={() => toggle("underlineLinks")}
              />
              <ToggleRow
                label="Reduce motion"
                checked={prefs.reduceMotion}
                onClick={() => toggle("reduceMotion")}
              />
              <ToggleRow
                label="Enhanced focus"
                checked={prefs.enhancedFocus}
                onClick={() => toggle("enhancedFocus")}
              />
            </div>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              onClick={reset}
            >
              <RotateCcw aria-hidden="true" size={18} />
              Reset preferences
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
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
      className="flex min-h-12 items-center justify-between gap-4 rounded-md border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
      onClick={onClick}
    >
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-red-600" : "bg-slate-300"
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
