const root = document.documentElement;
const stored = localStorage.getItem("theme");
if (stored) root.dataset.theme = stored;

document.addEventListener("click", (event) => {
  if (!(event.target as Element).closest(".theme-toggle")) return;
  const isDark = (root.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark";
  const next = isDark ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
});

document.addEventListener("click", (event) => {
  const nav = document.querySelector("header nav")!;
  const toggle = document.querySelector(".menu-toggle")!;
  const open = toggle.contains(event.target as Node) ? !nav.classList.contains("open") : false;
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
});
