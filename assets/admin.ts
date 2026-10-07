import { renderQuote, type Testimonial } from "./quote";

type Entry = Testimonial & { id: number; approved: number };
type Action = "approve" | "unapprove" | "delete";
type GoogleIdentity = {
  accounts: {
    id: {
      initialize(config: { client_id: string; callback: (response: { credential: string }) => void; auto_select: boolean }): void;
      prompt(): void;
      renderButton(parent: HTMLElement, options: { theme: string }): void;
    };
  };
};

const root = document.querySelector<HTMLElement>("#admin")!;
const panel = root.querySelector<HTMLElement>(".admin-testimonials")!;
const buttonSlot = root.querySelector<HTMLElement>(".g_id_signin-slot")!;
const diagnostic = root.querySelector<HTMLElement>(".diagnostic")!;
let credential = "";

const call = (method: string, body?: object) =>
  fetch("/api/admin/testimonials", {
    method,
    headers: { Authorization: `Bearer ${credential}` },
    body: body && JSON.stringify(body),
  });

const actionButton = (label: string, id: number, action: Action) => {
  const button = document.createElement("button");
  button.textContent = label;
  button.onclick = async () => {
    if (action === "delete" && !confirm("Delete this testimonial permanently?")) return;
    await call("POST", { id, action });
    await load();
  };
  return button;
};

const render = (entry: Entry) => {
  const { id, approved } = entry;
  const quote = renderQuote(entry);
  if (approved) quote.appendChild(actionButton("Unapprove", id, "unapprove"));
  else quote.appendChild(actionButton("Approve", id, "approve"));
  quote.appendChild(actionButton("Delete", id, "delete"));
  return quote;
};

const fill = (selector: string, entries: Entry[]) => {
  const target = root.querySelector(selector)!;
  target.replaceChildren(...entries.map(render));
  if (!entries.length) target.textContent = "None.";
};

const load = async () => {
  const response = await call("GET");
  if (!response.ok) {
    buttonSlot.hidden = false;
    diagnostic.textContent = `Admin access failed (${response.status}): ${(await response.text()) || response.statusText}`;
    diagnostic.hidden = false;
    panel.hidden = true;
    return;
  }
  const entries = (await response.json()) as Entry[];
  fill(".pending", entries.filter((entry) => !entry.approved));
  fill(".approved", entries.filter((entry) => entry.approved));
  buttonSlot.hidden = true;
  diagnostic.hidden = true;
  panel.hidden = false;
};

const start = () => {
  const google = (window as unknown as { google?: GoogleIdentity }).google;
  if (!google) return setTimeout(start, 100);
  google.accounts.id.initialize({
    client_id: root.dataset.clientId!,
    auto_select: true,
    callback: (response) => {
      credential = response.credential;
      load();
    },
  });
  google.accounts.id.renderButton(buttonSlot, { theme: "outline" });
  google.accounts.id.prompt();
};

start();
