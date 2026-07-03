import _ from 'lodash';
import AbstractCalculator from './AbstractCalculator';

/**
 * Used for any Token-specific calculations.
 */
export default class TokenCalculator extends AbstractCalculator {
  /**
   * Determine if the relevant HP data does not exist within the Token entity.
   *
   * If not, we should be coordinating using the relevant Actor instead.
   *
   * @param tokenDoc
   *   The Token Document or Token entity to check.
   *
   * @return {boolean}
   *   If we should use Actor coordination instead.
   */
  shouldUseActorCoordination(tokenDoc) {
    const hpObjectPath = this.hpObjectPathFinder.getHpPath();
    const actorSystem = tokenDoc?.actor?.system || tokenDoc?.delta?.system;
    return !actorSystem || !_.has(actorSystem, hpObjectPath);
  }

  _getOrigEntityHpPath() {
    return `actor.system.${this.hpObjectPathFinder.getHpPath()}`;
  }

  _getOrigEntityHpTempPath() {
    return `actor.system.${this.hpObjectPathFinder.getHpTempPath()}`;
  }

  _getChangedEntityHpPath() {
    return `actor.system.${this.hpObjectPathFinder.getHpPath()}`;
  }

  _getChangedEntityHpTempPath() {
    return `actor.system.${this.hpObjectPathFinder.getHpTempPath()}`;
  }
}
