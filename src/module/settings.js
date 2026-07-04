import { MODULE_ID } from '../constants.js';
import { log } from '../lib/logger.js';
import { localize } from '../lib/utils.js';
import Constants from './Constants.js';
import CombatNumbersConfig from './CombatNumbersConfig.js';

export default () => {
  // Register Log Verbosity Setting
  game.settings.register(MODULE_ID, 'logVerbosity', {
    name: localize('COMBATNUMBERS.SETTINGS.logVerbosityName', 'Log Verbosity'),
    hint: localize('COMBATNUMBERS.SETTINGS.logVerbosityHint', 'Control the level of logging output in the browser developer console.'),
    scope: 'client',
    config: true,
    type: String,
    default: 'warn',
    choices: {
      error: localize('COMBATNUMBERS.SETTINGS.logVerbosityError', 'Errors Only'),
      warn: localize('COMBATNUMBERS.SETTINGS.logVerbosityWarn', 'Warnings & Errors'),
      info: localize('COMBATNUMBERS.SETTINGS.logVerbosityInfo', 'Info, Warnings & Errors'),
      debug: localize('COMBATNUMBERS.SETTINGS.logVerbosityDebug', 'Debug (Verbose)'),
    },
    onChange: (value) => {
      log.setVerbosity(value);
    },
  });

  game.settings.register(MODULE_ID, 'hide_core_scrolling_text', {
    name: localize('COMBATNUMBERS.SETTINGS.hideCoreScrollingTextName', 'Hide Core Foundry Scrolling Text'),
    hint: localize('COMBATNUMBERS.SETTINGS.hideCoreScrollingTextHint', "Hides Foundry VTT's built-in scrolling text on tokens so only Combat Numbers is displayed."),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  const dispositionChoices = {};
  dispositionChoices[Constants.MASKED_DISPOSITION_CHOICES.HOSTILE] = localize(
    'COMBATNUMBERS.SETTINGS.maskDispositionChoiceHostile',
    'Hostile',
  );
  dispositionChoices[Constants.MASKED_DISPOSITION_CHOICES.HOSTILE_NEUTRAL] = localize(
    'COMBATNUMBERS.SETTINGS.maskDispositionChoiceHostileNeutral',
    'Hostile, Neutral',
  );
  dispositionChoices[Constants.MASKED_DISPOSITION_CHOICES.HOSTILE_NETURAL_FRIENDLY] = localize(
    'COMBATNUMBERS.SETTINGS.maskDispositionChoiceHostileNeutralFriendly',
    'Hostile, Neutral, Friendly',
  );

  // The Appearance settings menu and settings entry...
  game.settings.registerMenu(Constants.MODULE_NAME, 'appearanceMenu', {
    name: 'COMBATNUMBERS.SETTINGS.configName',
    label: 'COMBATNUMBERS.SETTINGS.configTitle',
    hint: 'COMBATNUMBERS.SETTINGS.configHint',
    icon: 'fa-solid fa-palette',
    type: CombatNumbersConfig,
    restricted: true,
  });
  game.settings.register(Constants.MODULE_NAME, 'appearance', {
    name: 'Appearance',
    hint: 'The appearance settings, all contained within an object',
    scope: 'world',
    config: false,
    default: CombatNumbersConfig.DEFAULT_APPEARANCE,
    type: Object,
  });

  // All other normal settings...
  game.settings.register(Constants.MODULE_NAME, 'wait_time', {
    name: localize('COMBATNUMBERS.SETTINGS.waitTimeName', 'Wait Time'),
    hint: localize('COMBATNUMBERS.SETTINGS.waitTimeHint', 'The amount of time (in seconds) between an HP change and displaying the Combat Numbers.'),
    scope: 'world',
    config: true,
    range: { min: 0, max: 10, step: 0.5 },
    default: 0,
    type: Number,
  });
  game.settings.register(Constants.MODULE_NAME, 'linger_time', {
    name: localize('COMBATNUMBERS.SETTINGS.lingerTimeName', 'Linger Time'),
    hint: localize('COMBATNUMBERS.SETTINGS.lingerTimeHint', 'The amount of time (in seconds) for the Combat Numbers to linger on the screen after being displayed.'),
    scope: 'world',
    config: true,
    range: { min: 0, max: 10, step: 0.5 },
    default: 1.5,
    type: Number,
  });
  game.settings.register(Constants.MODULE_NAME, 'show_controls', {
    name: localize('COMBATNUMBERS.SETTINGS.showControlsName', 'Show Canvas Layer Controls'),
    hint: localize('COMBATNUMBERS.SETTINGS.showControlsHint', 'Shows the Canvas Layers Controls button and its tools.'),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    onChange: () => window.location.reload(),
  });
  game.settings.register(Constants.MODULE_NAME, 'show_modifiers', {
    name: localize('COMBATNUMBERS.SETTINGS.showModifiersName', 'Show Addition / Subtraction Modifiers'),
    hint: localize('COMBATNUMBERS.SETTINGS.showModifiersHint', 'Shows a "-" in front of a Combat Number when damage is dealt, or shows a "+" when healed.'),
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register(Constants.MODULE_NAME, 'mask_default', {
    name: localize('COMBATNUMBERS.SETTINGS.maskDefaultName', 'Mask Default State'),
    hint: localize('COMBATNUMBERS.SETTINGS.maskDefaultHint', 'The default state of the masking toggle.'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register(Constants.MODULE_NAME, 'mask_disposition', {
    name: localize('COMBATNUMBERS.SETTINGS.maskDispositionName', 'Masked Token Disposition Types'),
    hint: localize('COMBATNUMBERS.SETTINGS.maskDispositionHint', 'The tokens that will be masked when masking is turned on.'),
    scope: 'world',
    config: true,
    default: Constants.MASKED_DISPOSITION_CHOICES.HOSTILE,
    type: Number,
    choices: dispositionChoices,
  });
  game.settings.register(Constants.MODULE_NAME, 'mask_damage', {
    name: localize('COMBATNUMBERS.SETTINGS.maskDamage', 'Mask Damage Text'),
    hint: localize('COMBATNUMBERS.SETTINGS.maskDamageHint', 'When masking is on, this text will display for damage.'),
    scope: 'client',
    config: true,
    default: 'Hit',
    type: String,
  });
  game.settings.register(Constants.MODULE_NAME, 'mask_heal', {
    name: localize('COMBATNUMBERS.SETTINGS.maskHeal', 'Mask Heal Text'),
    hint: localize('COMBATNUMBERS.SETTINGS.maskHealHint', 'When masking is on, this text will display for healing.'),
    scope: 'client',
    config: true,
    default: 'Healed',
    type: String,
  });
  game.settings.register(Constants.MODULE_NAME, 'hp_object_path', {
    name: localize('COMBATNUMBERS.SETTINGS.hpObjectPathName', 'HP Object Path'),
    hint: localize('COMBATNUMBERS.SETTINGS.hpObjectPathHint', 'Object path to locate the HP attribute.'),
    scope: 'world',
    config: false,
    default: '',
    type: String,
  });
  game.settings.register(Constants.MODULE_NAME, 'temp_hp_object_path', {
    name: localize('COMBATNUMBERS.SETTINGS.tempHpObjectPathName', 'Temporary HP Object Path'),
    hint: localize('COMBATNUMBERS.SETTINGS.tempHpObjectPathHint', 'Object path referencing temporary HP.'),
    scope: 'world',
    config: false,
    default: '',
    type: String,
  });
};
