import isEqual from 'lodash/isEqual';

const PROGRESS_INDICATOR_SELECTOR =
  'div[data-progress][aria-valuemin="0"][aria-valuemax="100"]';

// global states
let progressIndicators: Element[] = [];
let progressObservers: MutationObserver[] = [];

const handleMutation: MutationCallback = (mutations) => {
  const current = mutations[mutations.length - 1];
  // @ts-ignore aria-valuenow is not on type Node
  const ariaValueNow = current.target.ariaValueNow as number | undefined;
  const value = ariaValueNow !== undefined ? ariaValueNow : 0;
  console.log(value);
};

const attachEventHandlers = (elements: Element[]) => {
  if (elements.length === 0) {
    return;
  }
  progressObservers = elements.map((e) => {
    const Observer = new MutationObserver(handleMutation);
    Observer.observe(e, {
      childList: false,
      subtree: false,
      attributes: true,
      characterData: false,
    });
    return Observer;
  });
};

const run = () => {
  const bodyObserver = new MutationObserver(() => {
    const progressIndicatorElements = document.querySelectorAll(
      PROGRESS_INDICATOR_SELECTOR
    );
    const elements = Array.from(progressIndicatorElements);
    if (isEqual(progressIndicators, elements)) {
      return;
    }
    progressIndicators = elements;
    attachEventHandlers(elements);
  });
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  // cleanup
  window.onbeforeunload = () => {
    bodyObserver.disconnect();
    progressObservers.forEach((mo) => {
      mo.disconnect();
    });
  };
};

(() => {
  if (document.readyState === 'complete') {
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run);
  }
})();
