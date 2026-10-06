type Testimonial = { name: string | null; body: string };

const section = document.querySelector<HTMLElement>("#testimonials");
const list = section?.querySelector(".testimonial-list");

const render = ({ name, body }: Testimonial) => {
  const quote = document.createElement("blockquote");
  quote.textContent = body;
  if (name) {
    const cite = document.createElement("cite");
    cite.textContent = name;
    quote.appendChild(cite);
  }
  return quote;
};

const show = (entries: Testimonial[]) => {
  if (!section || !list || !entries.length) return;
  entries.forEach((entry) => list.appendChild(render(entry)));
  section.hidden = false;
};

fetch("/api/testimonials")
  .then((response) => (response.ok ? (response.json() as Promise<Testimonial[]>) : []))
  .then(show, () => {});
