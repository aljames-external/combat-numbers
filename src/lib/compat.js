/**
 * Namespace compatibility shims for Foundry VTT API updates across versions.
 */

export const CanvasLayer = foundry.canvas?.layers?.CanvasLayer ?? globalThis.CanvasLayer;
export const InteractionLayer = foundry.canvas?.layers?.InteractionLayer ?? globalThis.InteractionLayer;
export const Token = foundry.canvas?.placeables?.Token ?? globalThis.Token;
