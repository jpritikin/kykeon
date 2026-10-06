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
