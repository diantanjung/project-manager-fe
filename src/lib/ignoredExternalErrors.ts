const WEB_VITALS_START_TIME_ERROR = "Cannot read properties of undefined (reading 'startTime')";

export const isIgnoredExternalError = (event: ErrorEvent) => {
  const stack = event.error instanceof Error ? event.error.stack : undefined;

  return (
    event.message.includes(WEB_VITALS_START_TIME_ERROR) &&
    typeof stack === "string" &&
    stack.includes("reportAllChanges")
  );
};

export const registerIgnoredExternalErrors = () => {
  window.addEventListener(
    "error",
    (event) => {
      if (isIgnoredExternalError(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
};
