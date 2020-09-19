import isEqual from 'lodash/isEqual';

const PROGRESS_INDICATOR_SELECTOR =
  '[data-progress][aria-valuemin="0"][aria-valuemax="100"]';

// global states
let progressIndicators: Element[];

const bodyObserver = new MutationObserver((_mutations) => {
  const progressIndicatorElements = document.querySelectorAll(
    PROGRESS_INDICATOR_SELECTOR
  );
  const elements = Array.from(progressIndicatorElements);
  if (isEqual(progressIndicators, elements)) {
    return;
  }
  console.log(elements);
  progressIndicators = elements;
});

const run = () => {
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  // cleanup
  window.onbeforeunload = () => {
    bodyObserver.disconnect();
  };
};

(() => {
  if (document.readyState === 'complete') {
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run);
  }
})();
