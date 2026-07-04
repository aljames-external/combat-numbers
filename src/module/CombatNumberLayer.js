import { CanvasLayer } from '../lib/compat.js';

/**
 * Module-specific layer which we can render combat numbers on.
 */
export default class CombatNumberLayer extends CanvasLayer {
  /**
   * Override the layer options to situate our layer.
   *
   * @return {*}
   */
  static get layerOptions() {
    const parentOpts = super.layerOptions || {};
    return foundry.utils.mergeObject(parentOpts, {
      name: 'combatNumbers',
      canDragCreate: false,
      // This will set the combat numbers above the effects layer, but below
      // the controls layer.
      zIndex: 350,
    });
  }
}
