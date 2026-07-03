/**
 * Namespace compatibility shims for Foundry VTT API updates across versions.
 */

export const CanvasLayer = foundry.canvas?.layers?.CanvasLayer ?? globalThis.CanvasLayer;
export const InteractionLayer = foundry.canvas?.layers?.InteractionLayer ?? globalThis.InteractionLayer;
export const Token = foundry.canvas?.placeables?.Token ?? globalThis.Token;

export const ApplicationV2 = foundry.applications?.api?.ApplicationV2 ?? globalThis.Application;
export const HandlebarsApplicationMixin = foundry.applications?.api?.HandlebarsApplicationMixin ?? ((base) => base);
