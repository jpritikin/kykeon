document.querySelectorAll<HTMLHeadingElement>("main :is(h1,h2,h3,h4,h5,h6)[id]").forEach((heading) => {
  heading.classList.add("heading-copy");
  heading.addEventListener("click", async (event) => {
    if ((event.target as Element).closest("a")) return;
    history.replaceState(null, "", `#${heading.id}`);
    try {
      await navigator.clipboard.writeText(`${location.origin}${location.pathname}#${heading.id}`);
    } catch {}
  });
});
