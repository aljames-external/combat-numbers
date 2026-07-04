import { localize } from '../lib/utils.js';
import Constants from './Constants.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Configure appearance settings of Combat Numbers in ApplicationV2.
 */
export default class CombatNumbersConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: 'combat-numbers-config',
    classes: ['cn-config-form', 'cn-appearance-form'],
    tag: 'form',
    form: {
      handler: CombatNumbersConfig.onSubmitForm,
      closeOnSubmit: true,
    },
    window: {
      title: 'COMBATNUMBERS.SETTINGS.configTitle',
      icon: 'fa-solid fa-palette',
      resizable: false,
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
   * Dynamically query all available font families in Foundry VTT.
   *
   * @return {Array<string>}
   */
  static get FONT_FAMILIES() {
    const defaultFonts = [
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

    let foundryFonts = [];
    if (typeof FontConfig !== 'undefined' && typeof FontConfig.getAvailableFonts === 'function') {
      try {
        foundryFonts = Array.from(FontConfig.getAvailableFonts());
      } catch (err) {
        // Fallback if FontConfig throws
      }
    }

    if (!foundryFonts.length && CONFIG?.fontDefinitions) {
      foundryFonts = Object.keys(CONFIG.fontDefinitions);
    }

    if (CONFIG?.fontFamily && !foundryFonts.includes(CONFIG.fontFamily)) {
      foundryFonts.push(CONFIG.fontFamily);
    }

    const fontSet = new Set([...defaultFonts, ...foundryFonts]);
    return Array.from(fontSet).sort((a, b) => a.localeCompare(b));
  }

  /**
   * The available font sizes to choose from.
   *
   * @return {Object}
   */
  static get FONT_SIZES() {
    return {
      xsmall: localize('COMBATNUMBERS.SETTINGS.fontSizeXSmall', 'Extra Small'),
      small: localize('COMBATNUMBERS.SETTINGS.fontSizeSmall', 'Small'),
      medium: localize('COMBATNUMBERS.SETTINGS.fontSizeMedium', 'Medium'),
      large: localize('COMBATNUMBERS.SETTINGS.fontSizeLarge', 'Large'),
      xlarge: localize('COMBATNUMBERS.SETTINGS.fontSizeXLarge', 'Extra Large'),
    };
  }

  /** @override */
  async _prepareContext(options) {
    const appearance = game.settings.get(Constants.MODULE_NAME, 'appearance') || CombatNumbersConfig.DEFAULT_APPEARANCE;
    const defaultAppearance = CombatNumbersConfig.DEFAULT_APPEARANCE;

    const currentFont = appearance.font ?? defaultAppearance.font;
    const availableFonts = CombatNumbersConfig.FONT_FAMILIES;

    if (!availableFonts.includes(currentFont)) {
      availableFonts.push(currentFont);
      availableFonts.sort((a, b) => a.localeCompare(b));
    }

    const fontListObj = {};
    availableFonts.forEach((fName) => {
      fontListObj[fName] = fName;
    });

    return {
      fontList: fontListObj,
      fontSizeList: CombatNumbersConfig.FONT_SIZES,
      font: currentFont,
      fontSize: appearance.fontSize ?? defaultAppearance.fontSize,
      bold: appearance.bold ?? defaultAppearance.bold,
      italic: appearance.italic ?? defaultAppearance.italic,
      damageColor: appearance.damageColor ?? defaultAppearance.damageColor,
      healColor: appearance.healColor ?? defaultAppearance.healColor,
      strokeColor: appearance.strokeColor ?? defaultAppearance.strokeColor,
      strokeThickness: appearance.strokeThickness ?? defaultAppearance.strokeThickness,
      dropShadowColor: appearance.dropShadowColor ?? defaultAppearance.dropShadowColor,
      dropShadowAlpha: appearance.dropShadowAlpha ?? defaultAppearance.dropShadowAlpha,
    };
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    const html = $(this.element);

    const appearance = game.settings.get(Constants.MODULE_NAME, 'appearance') || CombatNumbersConfig.DEFAULT_APPEARANCE;
    html.find('select[name="font"]').val(appearance.font);

    html.find('select[name="font"]').on('change input', () => {
      this.updatePreview(html);
    });

    // Collapsible category section handlers
    html.find('.cn-category-header.cn-collapsible').click((e) => {
      const header = $(e.currentTarget);
      const list = header.next('.cn-module-list');
      header.toggleClass('collapsed');
      list.slideToggle(200);
    });

    // Synchronize color text inputs and color pickers
    const syncColorPair = (textInput, pickerInput) => {
      textInput.on('input change', () => {
        pickerInput.val(textInput.val());
        this.updatePreview(html);
      });
      pickerInput.on('input change', () => {
        textInput.val(pickerInput.val());
        this.updatePreview(html);
      });
    };

    syncColorPair(html.find('#cnDamageColorInput'), html.find('#cnDamageColorPicker'));
    syncColorPair(html.find('#cnHealColorInput'), html.find('#cnHealColorPicker'));
    syncColorPair(html.find('#cnStrokeColorInput'), html.find('#cnStrokeColorPicker'));
    syncColorPair(html.find('#cnDropShadowColorInput'), html.find('#cnDropShadowColorPicker'));

    // Range slider value displays
    html.find('#cnStrokeThicknessRange').on('input change', (e) => {
      html.find('#cnStrokeThicknessValue').text(e.currentTarget.value);
      this.updatePreview(html);
    });

    html.find('#cnDropShadowAlphaRange').on('input change', (e) => {
      html.find('#cnDropShadowAlphaValue').text(e.currentTarget.value);
      this.updatePreview(html);
    });

    // Other inputs triggering preview update
    html.find('#cnFontSizeSelect, #cnBoldToggle, #cnItalicToggle').on('input change', () => {
      this.updatePreview(html);
    });

    html.find('#cnResetBtn').click(() => {
      this.reset(html);
    });

    // Initial preview render
    this.updatePreview(html);
  }

  /**
   * Update the live preview stage with current form values.
   *
   * @param {jQuery} html
   */
  updatePreview(html) {
    const font = html.find('select[name="font"]').val() || CombatNumbersConfig.DEFAULT_APPEARANCE.font;

    const fontSizeKey = html.find('select[name="fontSize"]').val();
    const fontSizeMap = {
      xsmall: 18,
      small: 24,
      medium: 32,
      large: 42,
      xlarge: 54,
    };
    const fontSize = fontSizeMap[fontSizeKey] || 32;

    const bold = html.find('#cnBoldToggle').is(':checked');
    const italic = html.find('#cnItalicToggle').is(':checked');

    const damageColor = html.find('#cnDamageColorInput').val() || '#ffffff';
    const healColor = html.find('#cnHealColorInput').val() || '#95ed98';

    const strokeColor = html.find('#cnStrokeColorInput').val() || '#000000';
    const strokeThickness = parseFloat(html.find('#cnStrokeThicknessRange').val()) || 0;

    const dropShadowColor = html.find('#cnDropShadowColorInput').val() || '#000000';
    const dropShadowAlpha = parseFloat(html.find('#cnDropShadowAlphaRange').val()) ?? 1;

    const textShadow = (dropShadowAlpha > 0)
      ? `2px 2px 4px rgba(${this._hexToRgb(dropShadowColor)}, ${dropShadowAlpha})`
      : 'none';

    const strokeStyle = (strokeThickness > 0)
      ? `-webkit-text-stroke: ${strokeThickness * 0.5}px ${strokeColor} !important; paint-order: stroke fill !important;`
      : '-webkit-text-stroke: none !important;';

    const baseStyle = `
      font-family: '${font}', sans-serif !important;
      font-size: ${fontSize}px !important;
      font-weight: ${bold ? 'bold' : 'normal'} !important;
      font-style: ${italic ? 'italic' : 'normal'} !important;
      text-shadow: ${textShadow} !important;
      ${strokeStyle}
    `;

    html.find('#cnPreviewDamage').attr('style', `${baseStyle} color: ${damageColor} !important;`);
    html.find('#cnPreviewHeal').attr('style', `${baseStyle} color: ${healColor} !important;`);
  }

  /**
   * Convert hex color to comma-separated RGB values for rgba text-shadow.
   *
   * @param {string} hex
   * @return {string}
   * @private
   */
  _hexToRgb(hex) {
    const cleanHex = hex.replace('#', '');
    const num = parseInt(cleanHex.length === 3 ? cleanHex.split('').map((c) => c + c).join('') : cleanHex, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }

  /**
   * Handle form submission in ApplicationV2.
   */
  static async onSubmitForm(event, form, formData) {
    const data = formData.object;

    const appearance = {
      font: data.font,
      fontSize: data.fontSize,
      bold: !!data.bold,
      italic: !!data.italic,
      damageColor: data.damageColor,
      healColor: data.healColor,
      strokeColor: data.strokeColor,
      strokeThickness: Number(data.strokeThickness),
      dropShadowColor: data.dropShadowColor,
      dropShadowAlpha: Number(data.dropShadowAlpha),
    };

    await game.settings.set(
      Constants.MODULE_NAME,
      'appearance',
      appearance,
    );
  }

  /**
   * Reset the form to its default state.
   *
   * @param {jQuery} html
   *   The jQuery HTML object of the form.
   */
  reset(html) {
    const defaultAppearance = CombatNumbersConfig.DEFAULT_APPEARANCE;

    html.find('select[name="font"]').val(defaultAppearance.font);
    html.find('select[name="fontSize"]').val(defaultAppearance.fontSize);
    html.find('#cnBoldToggle').prop('checked', defaultAppearance.bold);
    html.find('#cnItalicToggle').prop('checked', defaultAppearance.italic);

    html.find('#cnDamageColorInput').val(defaultAppearance.damageColor);
    html.find('#cnDamageColorPicker').val(defaultAppearance.damageColor);
    html.find('#cnHealColorInput').val(defaultAppearance.healColor);
    html.find('#cnHealColorPicker').val(defaultAppearance.healColor);

    html.find('#cnStrokeColorInput').val(defaultAppearance.strokeColor);
    html.find('#cnStrokeColorPicker').val(defaultAppearance.strokeColor);
    html.find('#cnStrokeThicknessRange').val(defaultAppearance.strokeThickness);
    html.find('#cnStrokeThicknessValue').text(defaultAppearance.strokeThickness);

    html.find('#cnDropShadowColorInput').val(defaultAppearance.dropShadowColor);
    html.find('#cnDropShadowColorPicker').val(defaultAppearance.dropShadowColor);
    html.find('#cnDropShadowAlphaRange').val(defaultAppearance.dropShadowAlpha);
    html.find('#cnDropShadowAlphaValue').text(defaultAppearance.dropShadowAlpha);

    this.updatePreview(html);
  }
}
