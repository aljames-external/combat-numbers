/**
 * Lightweight native PIXI animation utility replacing pixi-ease.
 */
class SimpleEase {
  add(target, props, options = {}) {
    const duration = options.duration || 100;
    const wait = options.wait || 0;
    const initialProps = {};

    for (const prop of Object.keys(props)) {
      initialProps[prop] = target[prop];
    }

    let elapsed = 0;
    let started = false;

    const listeners = { complete: [] };

    const eventObj = {
      once(event, callback) {
        if (event === 'complete') {
          listeners.complete.push(callback);
        }
      },
    };

    const tickerCallback = (ticker) => {
      const deltaMS = ticker.deltaMS || 16.66;
      elapsed += deltaMS;

      if (elapsed < wait) return;

      if (!started) {
        started = true;
      }

      const animElapsed = elapsed - wait;
      const progress = Math.min(animElapsed / duration, 1);

      for (const prop of Object.keys(props)) {
        const start = initialProps[prop];
        const end = props[prop];
        target[prop] = start + (end - start) * progress;
      }

      if (progress >= 1) {
        canvas.app.ticker.remove(tickerCallback);
        for (const cb of listeners.complete) {
          cb();
        }
      }
    };

    canvas.app.ticker.add(tickerCallback);
    return eventObj;
  }
}

export const ease = new SimpleEase();
