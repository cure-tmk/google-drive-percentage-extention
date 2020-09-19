import isEqual from 'lodash/isEqual';

const PROGRESS_INDICATOR_SELECTOR =
  'div[data-progress][aria-valuemin="0"][aria-valuemax="100"]';

// global states
let progressIndicators: Element[] = [];
let progressObservers: MutationObserver[] = [];

const renderProgress = (percentage: number): string => {
  const size = 40;
  const strokeWidth = 2;
  const radius = size / 2 - strokeWidth * 2;
  const circum = radius * 2 * Math.PI;
  const offset = circum - (percentage / 100) * circum;
  return `
  <svg
    style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:${size}; height: ${size};"
    height="${size}"
    width="${size}"
  >
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dy=".35em"
      style="font-size: 12px; color:#757575; opacity: 0.5;"
    >${percentage}%</text>
    <circle
      stroke="#757575"
      stroke-width="${strokeWidth}"
      fill="transparent"
      r="${radius}"
      cx="${size / 2}"
      cy="${size / 2}"
      style="opacity: 0.5"
    />
    <circle
      stroke="#4285f4"
      stroke-width="${strokeWidth}"
      stroke-dasharray="${circum} ${circum}"
      stroke-dashoffset="${offset}"
      fill="transparent"
      r="${radius}"
      cx="${size / 2}"
      cy="${size / 2}"
      transform="rotate(-90,${size / 2},${size / 2})"
    />
  </svg>
  `;
};

const handleMutation: MutationCallback = (mutations) => {
  const current = mutations[mutations.length - 1]?.target as
    | HTMLElement
    | undefined;
  if (current === undefined) {
    return;
  }
  // @ts-ignore aria-valuenow is not on type Node
  const ariaValueNow = current.ariaValueNow as number | undefined;
  const percentage = ariaValueNow !== undefined ? ariaValueNow : 0;
  current.innerHTML = renderProgress(percentage);
  current.style.animation = 'none'; // prevent spinning
  current.style.position = 'relative';
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
