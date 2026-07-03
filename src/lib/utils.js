/**
 * Helper to safely localize a key, falling back to a default string if the key is not found.
 * @param {string} key The localization key
 * @param {string} fallback The fallback string to use if localization is missing
 * @returns {string} The localized string or fallback
 */
export function localize(key, fallback) {
  return game.i18n?.has(key) ? game.i18n.localize(key) : (fallback || key);
}
