export async function copyText(value: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall through to the legacy path for browsers that deny clipboard
      // access even in a secure context.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const succeeded = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!succeeded) {
    throw new Error("Copy command failed");
  }
}
