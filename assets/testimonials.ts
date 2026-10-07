import { renderQuote, type Testimonial } from "./quote";

const section = document.querySelector<HTMLElement>("#testimonials");
const list = section?.querySelector(".testimonial-list");

const show = (entries: Testimonial[]) => {
  if (!section || !list || !entries.length) return;
  entries.forEach((entry) => list.appendChild(renderQuote(entry)));
  section.hidden = false;
};

fetch("/api/testimonials")
  .then((response) => (response.ok ? (response.json() as Promise<Testimonial[]>) : []))
  .then(show, () => {});
