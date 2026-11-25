import { renderQuote, type Testimonial } from "./quote";

const section = document.querySelector<HTMLElement>("#testimonials");
const picker = section?.querySelector<HTMLSelectElement>(".testimonial-picker");
const display = section?.querySelector(".testimonial-list");

const hashId = () => new URLSearchParams(location.hash.slice(1)).get("testimonial");

const excerpt = ({ name, body }: Testimonial) => {
  const text = body.length > 60 ? `${body.slice(0, 60).trimEnd()}…` : body;
  return name ? `${name}: ${text}` : text;
};

const show = (entries: Testimonial[]) => {
  if (!section || !picker || !display || !entries.length) return;
  entries.forEach((entry) => picker.add(new Option(excerpt(entry), String(entry.id))));
  const render = () => {
    const entry = entries.find((candidate) => String(candidate.id) === picker.value)!;
    display.replaceChildren(renderQuote(entry));
  };
  const select = () => {
    const id = hashId();
    picker.value = entries.some((entry) => String(entry.id) === id) ? id! : String(entries[0].id);
    render();
  };
  picker.addEventListener("change", () => {
    history.replaceState(null, "", `#testimonial=${picker.value}`);
    render();
  });
  addEventListener("hashchange", select);
  select();
  picker.hidden = entries.length < 2;
  section.hidden = false;
};

fetch(`/api/testimonials?id=${encodeURIComponent(hashId() ?? "")}`)
  .then((response) => (response.ok ? (response.json() as Promise<Testimonial[]>) : []))
  .then(show, () => {});
