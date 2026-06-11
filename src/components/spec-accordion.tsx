"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/commerce/types";

type SpecAccordionProps = {
  product: Product;
};

export function SpecAccordion({ product }: SpecAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      defaultValue="specs"
      collapsible
      className="rounded-lg border border-slate-200 bg-white"
    >
      <AccordionItem value="specs" title="Technical specs">
        <dl className="grid gap-4 sm:grid-cols-2">
          {product.technicalSpecs.map((spec) => (
            <div key={spec.label} className="rounded-md bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {spec.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{spec.value}</dd>
            </div>
          ))}
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Molecular weight
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {product.molecularWeight}
            </dd>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Sequence
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{product.sequence}</dd>
          </div>
        </dl>
      </AccordionItem>
      <AccordionItem value="storage" title="Storage and documentation">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Purity
            </div>
            <p className="mt-1 text-sm font-medium text-slate-900">{product.purityLabel}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Storage
            </div>
            <p className="mt-1 text-sm font-medium text-slate-900">{product.storageLabel}</p>
          </div>
        </div>
      </AccordionItem>
    </Accordion.Root>
  );
}

function AccordionItem({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion.Item value={value} className="border-b border-slate-200 last:border-b-0">
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-slate-950">
          {title}
          <ChevronDown
            aria-hidden="true"
            size={18}
            className="transition group-data-[state=open]:rotate-180"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="px-5 pb-5">{children}</Accordion.Content>
    </Accordion.Item>
  );
}
