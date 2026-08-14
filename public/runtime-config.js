/**
 * Runtime config injected at build time for Amplify (and empty for local).
 * Local Express serves front + API on the same origin, so API_BASE_URL can stay "".
 */
window.RUNTIME_CONFIG = {
  API_BASE_URL: "",
};
