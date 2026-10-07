export type Testimonial = { name: string | null; body: string; seeds: number | null; thh_mg: number | null };

const doseSummary = ({ seeds, thh_mg }: Testimonial) =>
  [seeds != null && `${seeds} HBW seeds`, thh_mg != null && `${thh_mg} mg THH`].filter(Boolean).join(" · ");

const paragraph = (className: string, text: string) => {
  const element = document.createElement("p");
  element.className = className;
  element.textContent = text;
  return element;
};

export const renderQuote = (entry: Testimonial) => {
  const quote = document.createElement("blockquote");
  quote.textContent = entry.body;
  const doses = doseSummary(entry);
  if (doses) quote.appendChild(paragraph("doses", doses));
  if (entry.name) {
    const cite = document.createElement("cite");
    cite.textContent = entry.name;
    quote.appendChild(cite);
  }
  return quote;
};
