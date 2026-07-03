import { localize } from '../lib/utils.js';
import Constants from './Constants.js';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * ApplicationV2 form to configure appearance settings of Combat Numbers.
 */
export default class CombatNumbersConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.fontOther = localize('COMBATNUMBERS.SETTINGS.fontFamilyOther', 'Other');
  }

  static DEFAULT_OPTIONS = {
    id: 'combat-numbers-config',
    classes: ['combat-numbers-config-window'],
    tag: 'form',
    form: {
      handler: CombatNumbersConfig.onSubmitForm,
      closeOnSubmit: true,
    },
    window: {
      title: 'COMBATNUMBERS.SETTINGS.configTitle',
      icon: 'fa-solid fa-palette',
    },
    position: {
      width: 560,
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
      xsmall: localize('COMBATNUMBERS.SETTINGS.fontSizeXSmall', 'Extra Small'),
      small: localize('COMBATNUMBERS.SETTINGS.fontSizeSmall', 'Small'),
      medium: localize('COMBATNUMBERS.SETTINGS.fontSizeMedium', 'Medium'),
      large: localize('COMBATNUMBERS.SETTINGS.fontSizeLarge', 'Large'),
      xlarge: localize('COMBATNUMBERS.SETTINGS.fontSizeXLarge', 'Extra Large'),
    };
  }

  /** @override */
  async _prepareContext(options) {
    const appearance = game.settings.get(Constants.MODULE_NAME, 'appearance');
    const defaultAppearance = CombatNumbersConfig.DEFAULT_APPEARANCE;

    const fontName = appearance.font ?? defaultAppearance.font;
    const fontKey = String(this._getFontKeyByName(fontName));

    const fontListObj = {};
    this._getFontList().forEach((fName, idx) => {
      fontListObj[idx] = fName;
    });

    return {
      fontList: fontListObj,
      fontSizeList: CombatNumbersConfig.FONT_SIZES,
      font: fontKey,
      fontOther: fontName,
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

    const appearance = game.settings.get(Constants.MODULE_NAME, 'appearance');
    const fontKey = this._getFontKeyByName(appearance.font);

    html.find('select[name="font"]').val(fontKey);

    const fontOtherFormGroup = html.find('.form-group-font-other');
    const fontOther = html.find('#fontOther');

    if (this._getFontList()[fontKey] === this.fontOther) {
      fontOtherFormGroup.show();
      fontOther.val(appearance.font);
    }

    const fontOtherName = this.fontOther;

    html.find('select[name="font"]').change((e) => {
      const optionName = $(e.currentTarget).find('option:selected').text();
      if (optionName !== fontOtherName) {
        fontOther.val('');
        fontOtherFormGroup.hide();
      } else {
        fontOtherFormGroup.show();
      }
      this.updatePreview(html);
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
    html.find('#cnFontSizeSelect, #cnBoldToggle, #cnItalicToggle, #fontOther').on('input change', () => {
      this.updatePreview(html);
    });

    html.find('button[name="reset"]').click(() => {
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
    const selectedFontKey = parseInt(html.find('select[name="font"]').val(), 10);
    const font = this._getSelectedFont(selectedFontKey, {
      fontOther: html.find('#fontOther').val(),
    });

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
      ? `-webkit-text-stroke: ${strokeThickness * 0.5}px ${strokeColor}; paint-order: stroke fill;`
      : '-webkit-text-stroke: none;';

    const baseStyle = `
      font-family: '${font}', sans-serif;
      font-size: ${fontSize}px;
      font-weight: ${bold ? 'bold' : 'normal'};
      font-style: ${italic ? 'italic' : 'normal'};
      text-shadow: ${textShadow};
      ${strokeStyle}
    `;

    html.find('#cnPreviewDamage').attr('style', `${baseStyle} color: ${damageColor};`);
    html.find('#cnPreviewHeal').attr('style', `${baseStyle} color: ${healColor};`);
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
    const fontList = CombatNumbersConfig.prototype._getFontList();
    const selectedFontKey = parseInt(data.font, 10);
    let selectedFont = fontList[selectedFontKey];

    if (selectedFont === localize('COMBATNUMBERS.SETTINGS.fontFamilyOther', 'Other')) {
      selectedFont = data.fontOther ? String(data.fontOther).trim() : CombatNumbersConfig.DEFAULT_APPEARANCE.font;
    }

    const appearance = {
      font: selectedFont,
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
    const fontKey = this._getFontKeyByName(defaultAppearance.font);

    html.find('select[name="font"]').val(fontKey);
    html.find('.form-group-font-other').hide();
    html.find('#fontOther').val('');
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

  /**
   * Get the numeric font key by the font name itself.
   *
   * @param {string} name
   *   The font name. Ex: "Verdana".
   *
   * @return {number}
   *   The font key in our array.
   *
   * @private
   */
  _getFontKeyByName(name) {
    const fontList = this._getFontList();
    const foundFontKey = fontList.findIndex(
      (font) => font === name,
    );

    if (foundFontKey === -1) {
      return fontList.findIndex(
        (font) => font === this.fontOther,
      );
    }

    return foundFontKey;
  }

  /**
   * Get the font list to display in the configuration dialog.
   *
   * @return {Array}
   *
   * @private
   */
  _getFontList() {
    const fonts = [...CombatNumbersConfig.FONT_FAMILIES];
    fonts.push(this.fontOther);

    return fonts;
  }

  /**
   * Get the selected font by the selected key from the font list.
   *
   * @param {number} selectedFontKey
   *   The selected key of the font list.
   * @param formData {Object}
   *   The object of validated form data with which to update the object.
   *
   * @return {string}
   *
   * @private
   */
  _getSelectedFont(selectedFontKey, formData) {
    const fontList = this._getFontList();
    const selected = fontList[selectedFontKey];

    if (selected === this.fontOther) {
      if (!formData?.fontOther) {
        return CombatNumbersConfig.DEFAULT_APPEARANCE.font;
      }

      return String(formData.fontOther).trim();
    }

    return selected;
  }
}
