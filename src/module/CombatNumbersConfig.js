import { ApplicationV2, HandlebarsApplicationMixin } from '../lib/compat.js';

export default class CombatNumbersConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: 'combat-numbers-config',
    classes: ['eskie-world-scripts-form', 'eskie-recommended-modules-form'],
    tag: 'form',
    window: {
      title: 'Combat Numbers Debug',
      icon: 'fa-solid fa-palette',
    },
    position: {
      width: 620,
      height: 'auto',
    },
  };

  static PARTS = {
    form: {
      template: 'modules/combat-numbers/src/templates/config.html',
    },
  };

  /**
   * The default appearance settings object.
   *
   * @return {Object}
   */
  static get DEFAULT_APPEARANCE() {
    return {
      font: 'Verdana',
      fontSize: 'medium',
      bold: true,
      italic: false,
      damageColor: '#ffffff',
      healColor: '#95ed98',
      strokeColor: '#000000',
      strokeThickness: 5,
      dropShadowColor: '#000000',
      dropShadowAlpha: 1,
    };
  }

  /**
   * The built-in font families to choose from.
   *
   * @return {array}
   */
  static get FONT_FAMILIES() {
    return [
      'Verdana',
      'Arial',
      'Helvetica',
      'Trebuchet MS',
      'Times New Roman',
      'Modesto',
      'Didot',
      'American Typewriter',
      'Andale Mono',
      'Courier',
      'Bradley Hand',
      'Luminari',
    ];
  }

  /**
   * The available font sizes to choose from.
   *
   * @return {Object}
   */
  static get FONT_SIZES() {
    return {
      xsmall: 'Extra Small',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      xlarge: 'Extra Large',
    };
  }

  /** @override */
  async _prepareContext(options) {
    const system = game.system;
    return {
      systemTitle: system.title,
      systemId: system.id,
      systemVersion: system.version,
    };
  }
}
