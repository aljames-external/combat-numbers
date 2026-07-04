import Constants from './Constants.js';

export default class CombatNumbersConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'combat-numbers-config',
      title: 'Combat Numbers Debug',
      template: 'modules/combat-numbers/src/templates/config.html',
      classes: ['eskie-world-scripts-form', 'eskie-recommended-modules-form'],
      width: 620,
      height: 'auto',
      closeOnSubmit: true,
    });
  }

  async getData(options) {
    const system = game.system;
    return {
      systemTitle: system.title,
      systemId: system.id,
      systemVersion: system.version,
    };
  }

  async _updateObject(event, formData) {
    return;
  }
}
