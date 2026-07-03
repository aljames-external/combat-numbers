import Constants from './Constants.js';

/**
 * A class for finding the HP Object path.
 */
export default class HpObjectPathFinder {
  constructor(settings) {
    /**
     * The global Foundry Settings object.
     */
    this.settings = settings;

    /**
     * The default HP path within the Entity.
     *
     * @type {string}
     */
    this.defaultHpPath = 'attributes.hp.value';

    /**
     * The default temporary HP path within the Entity.
     *
     * @type {string}
     */
    this.defaultTempHpPath = 'attributes.hp.temp';
  }

  /**
   * Get the HP object path.
   *
   * @return {string}
   */
  getHpPath() {
    return this._get('hp');
  }

  /**
   * Get the temporary HP object path.
   *
   * @return {string}
   */
  getHpTempPath() {
    return this._get('temp');
  }

  /**
   * Get the full path dependant on the type specified.
   *
   * @param {string} type
   *   Must be one of "temp" or "hp".
   *
   * @return {string}
   *   The final, constructed HP object path.
   *
   * @private
   */
  _get(type) {
    let settingsKey;
    let pathDefault;

    if (type === 'temp') {
      settingsKey = 'temp_hp_object_path';
      pathDefault = this.defaultTempHpPath;
    } else {
      settingsKey = 'hp_object_path';
      pathDefault = this.defaultHpPath;
    }

    let value = this.settings.get(Constants.MODULE_NAME, settingsKey);

    if (!value) {
      value = pathDefault;
    }

    value = value.trim();

    return value;
  }
}
