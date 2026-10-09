const form = document.querySelector<HTMLFormElement>("#signup form[action='/api/subscribe']");
const errorDialog = document.querySelector<HTMLDialogElement>("#signup .book-copy-error");

form?.addEventListener("submit", (event) => {
  const choice = form.elements.namedItem("book_copy") as RadioNodeList;
  if (choice.value) return;
  event.preventDefault();
  errorDialog?.showModal();
});

errorDialog?.querySelectorAll<HTMLButtonElement>("[data-book-copy]").forEach((button) =>
  button.addEventListener("click", () => {
    form!.querySelector<HTMLInputElement>(`input[name=book_copy][value=${button.dataset.bookCopy}]`)!.checked = true;
    errorDialog.close();
  }),
);

