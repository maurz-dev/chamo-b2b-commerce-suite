import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../../data/faq";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section
      id="preguntas-frecuentes"
      className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16"
      aria-labelledby="faq-heading"
    >
      <div className="flex flex-col items-center justify-center">
        <h2
          id="faq-heading"
          className="text-center text-3xl font-bold text-secondary dark:text-text"
        >
          Preguntas frecuentes
        </h2>
        <div className="mt-3 h-1 w-20 rounded-full bg-primary"></div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.pregunta}
              className={`overflow-hidden rounded-xl border border-border/50 shadow-sm transition-colors duration-300 ${
                isOpen ? "bg-bg shadow-md border-primary/20" : "bg-surface hover:border-primary/30 hover:shadow-md"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className={`text-base font-semibold transition-colors duration-300 ${isOpen ? "text-primary" : "text-text"}`}>{item.pregunta}</span>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                  isOpen ? "border-primary bg-primary text-white rotate-180" : "border-border text-text-muted bg-bg"
                }`}>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {/* Técnica grid-rows para animar altura automática sin JS */}
              <div
                id={`faq-panel-${index}`}
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-text-muted">
                    {item.respuesta}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
