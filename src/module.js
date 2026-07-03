/**
 * JavaScript entry file for Combat Numbers in Foundry VTT v13+.
 * Author: 1000Nettles / Bakana
 * Software License: MIT
 */

import registerSettings from './module/settings.js';
import CombatNumberLayer from './module/CombatNumberLayer.js';
import Renderer from './module/Renderer.js';
import SocketController from './module/SocketController.js';
import TokenUpdateCoordinator from './module/TokenUpdateCoordinator.js';
import ActorUpdateCoordinator from './module/ActorUpdateCoordinator.js';
import TokenCalculator from './module/calculator/TokenCalculator.js';
import ActorCalculator from './module/calculator/ActorCalculator.js';
import HpObjectPathFinder from './module/HpObjectPathFinder.js';
import ControlsGenerator from './module/ControlsGenerator.js';
import State from './module/State.js';
import Appearance from './module/Appearance.js';
import CombatNumbersApi from './external/CombatNumbersApi.js';
import Masking from './module/Masking.js';
import Constants from './module/Constants.js';
import { log } from './lib/logger.js';

let renderer;
let socketController;
let actorUpdateCoordinator;
let tokenUpdateCoordinator;
let tokenCalculator;
let actorCalculator;
let state;
let masking;

function registerStaticLayer() {
  CONFIG.Canvas.layers.combatNumbers = {
    layerClass: CombatNumberLayer,
    group: 'effects',
  };
}

/**
 * Find the currently viewed Scene for the User.
 *
 * @return {Scene|null}
 */
function findViewedScene() {
  return canvas.scene || game.scenes.find((s) => s.isView);
}

/* ------------------------------------ */
/* Initialize module                    */
/* ------------------------------------ */
Hooks.once('init', async () => {
  log.info('Initializing combat-numbers for Foundry VTT v13+');

  // Register custom module settings.
  registerSettings();

  registerStaticLayer();

  state = new State();
});

/**
 * Add a new layer to the canvas.
 *
 * This happens every time a scene change takes place.
 */
Hooks.on('canvasReady', async () => {
  const layer = canvas.combatNumbers
    || canvas.layers.find((targetLayer) => targetLayer instanceof CombatNumberLayer);

  const scene = canvas.scene;
  if (!scene) return;

  const appearance = new Appearance(
    game.settings.get(Constants.MODULE_NAME, 'appearance'),
    scene.grid.size,
  );

  masking = new Masking(state, game.settings);

  renderer = new Renderer(
    layer,
    game.settings,
    state,
    appearance,
  );

  if (socketController instanceof SocketController) {
    await socketController.deactivate();
  }

  socketController = new SocketController(game.socket, game.user, state, renderer);

  const hpObjectPathFinder = new HpObjectPathFinder(game.settings);
  tokenCalculator = new TokenCalculator(hpObjectPathFinder);
  actorCalculator = new ActorCalculator(hpObjectPathFinder);

  actorUpdateCoordinator = new ActorUpdateCoordinator(
    renderer,
    socketController,
    actorCalculator,
    state,
    masking,
  );
  tokenUpdateCoordinator = new TokenUpdateCoordinator(
    renderer,
    socketController,
    tokenCalculator,
    state,
    masking,
  );

  await socketController.init();

  const maskDefault = !!(game.settings.get(
    Constants.MODULE_NAME,
    'mask_default',
  ));
  state.setIsMask(maskDefault);

  // Register API for macros and other modules.
  globalThis.combatNumbers = new CombatNumbersApi(state);
});

Hooks.on('preUpdateActor', (actor, delta, options) => {
  const viewedScene = findViewedScene();
  if (!viewedScene) {
    return;
  }

  const activeTokens = actor.getActiveTokens
    ? actor.getActiveTokens()
    : canvas.tokens?.placeables.filter((t) => t.actor?.id === actor.id) || [];

  actorUpdateCoordinator.coordinatePreUpdate(
    actor,
    delta,
    activeTokens,
    viewedScene,
  );
});

Hooks.on('preUpdateToken', (tokenDoc, delta) => {
  if (tokenDoc.hidden) {
    return;
  }

  if (tokenCalculator.shouldUseActorCoordination(tokenDoc)) {
    const actorId = tokenDoc.actorId;
    const actorData = foundry.utils.getProperty(delta, 'actorData') || foundry.utils.getProperty(delta, 'delta');

    if (!actorId || !actorData) {
      return;
    }

    const origActor = game.actors.get(actorId);
    if (!origActor) {
      log.warn('Cannot find associated actor to token');
      return;
    }

    const viewedScene = tokenDoc.scene || canvas.scene;
    if (!viewedScene) {
      return;
    }

    actorUpdateCoordinator.coordinatePreUpdate(
      origActor,
      actorData,
      [tokenDoc],
      viewedScene,
    );

    return;
  }

  tokenUpdateCoordinator.coordinatePreUpdate(tokenDoc);
});

Hooks.on('updateToken', (tokenDoc, delta) => {
  if (tokenDoc.hidden) {
    return;
  }

  tokenUpdateCoordinator.coordinateUpdate(tokenDoc, delta);
});

Hooks.on('getSceneControlButtons', (controls) => {
  const showControls = !!(game.settings.get(
    Constants.MODULE_NAME,
    'show_controls',
  ));

  const controlsGenerator = new ControlsGenerator(state);
  controlsGenerator.generate(
    controls,
    game.user.isGM,
    showControls,
  );
});
