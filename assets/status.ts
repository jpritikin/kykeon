const outcome = new URLSearchParams(location.search).get("status");
if (outcome) document.querySelector(`[data-status-${outcome}]`)?.removeAttribute("hidden");
