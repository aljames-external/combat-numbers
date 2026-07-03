import HpObjectPathFinder from '../HpObjectPathFinder.js';

/**
 * Base class used for any Entity calculations.
 *
 * Must NOT be directly instantiated.
 *
 * @abstract
 */
export default class AbstractCalculator {
  constructor(hpObjectPathFinder) {
    if (!(hpObjectPathFinder instanceof HpObjectPathFinder)) {
      throw new Error('Required `hpObjectPathFinder` is not instance of HpObjectPathFinder');
    }

    this.hpObjectPathFinder = hpObjectPathFinder;
  }

  /**
   * Get the differences in HP from the original and changed entities.
   *
   * Not only will this take into consideration the raw HP amounts, but also
   * the temporary HP amounts.
   *
   * @param origEntity
   *   The original entity provided, before any changes have been made.
   * @param changedEntity
   *   The changed entity, consisting of only the properties that have changed.
   *
   * @return {number}
   *   The numerical HP difference.
   */
  getHpDiff(origEntity, changedEntity) {
    const changedEntityHpPath = this._getChangedEntityHpPath();
    const changedEntityTempHpPath = this._getChangedEntityHpTempPath();

    const origEntityHpPath = this._getOrigEntityHpPath();
    const origEntityHpTempPath = this._getOrigEntityHpTempPath();

    // First, ensure that we even have any HP changes at all.
    if (
      !foundry.utils.hasProperty(changedEntity, changedEntityHpPath)
      && !foundry.utils.hasProperty(changedEntity, changedEntityTempHpPath)
    ) {
      throw new ReferenceError('Cannot find any changed HP or HP temp attributes.');
    }

    // Secondly, find which part changed in the provided `changedEntity`
    // and return the difference.
    const rawHpChanged = foundry.utils.hasProperty(changedEntity, changedEntityHpPath);

    if (rawHpChanged) {
      return Number(foundry.utils.getProperty(changedEntity, changedEntityHpPath) ?? 0)
        - Number(foundry.utils.getProperty(origEntity, origEntityHpPath) ?? 0);
    }

    // If we're not using raw HP, we're using temp HP instead.
    return Number(foundry.utils.getProperty(changedEntity, changedEntityTempHpPath) ?? 0)
      - Number(foundry.utils.getProperty(origEntity, origEntityHpTempPath) ?? 0);
  }

  /**
   * Get the coordinates where the combat numbers should be rendered.
   *
   * @param scene
   *   The associated Scene object.
   * @param entity
   *   The original Token Entity provided.
   *
   * @return {x, y}
   *   The X and Y coordinates in an object of where we should render the combat
   *   numbers.
   */
  getCoordinates(scene, entity) {
    const center = entity?.center || (entity.x !== undefined && entity.y !== undefined ? { x: entity.x + ((entity.width || 1) * scene.grid.size) / 2, y: entity.y + ((entity.height || 1) * scene.grid.size) / 2 } : null);
    if (center) {
      return { x: center.x, y: center.y };
    }

    return this._calculateRawTokenCoords(scene, entity);
  }

  /**
   * Calculate a Token's coordinates based on their positioning and size.
   *
   * @param scene
   *   The current Scene.
   * @param token
   *   The Token Entity.
   *
   * @return {x, y}
   *   An object containing the X and Y coordinates.
   *
   * @private
   */
  _calculateRawTokenCoords(scene, token) {
    const coords = {};

    const gridSize = Number(scene?.grid?.size || 100);
    const width = Number(token.width || 1) * gridSize;
    const height = Number(token.height || 1) * gridSize;

    coords.x = Math.round(
      (token.x || 0) + (width / 2),
    );
    coords.y = Math.round(
      (token.y || 0) + (height / 2),
    );

    return coords;
  }

  /**
   * Get the HP object path for extracting from an "original entity".
   *
   * @private
   */
  _getOrigEntityHpPath() {
    throw new Error('Child class must implement `_getOrigEntityHpPath`');
  }

  /**
   * Get the temporary HP object path for extracting from an "original entity".
   *
   * @private
   */
  _getOrigEntityHpTempPath() {
    throw new Error('Child class must implement `_getOrigEntityHpTempPath`');
  }

  /**
   * Get the HP object path for extracting from a "changed entity".
   *
   * @private
   */
  _getChangedEntityHpPath() {
    throw new Error('Child class must implement `_getChangedEntityHpPath`');
  }

  /**
   * Get the temporary HP object path for extracting from a "changed entity".
   *
   * @private
   */
  _getChangedEntityHpTempPath() {
    throw new Error('Child class must implement `_getChangedEntityHpTempPath`');
  }
}
