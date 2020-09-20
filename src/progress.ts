class Progress {
  target: Element;
  isObserving: boolean;
  observer?: MutationObserver;
  currentPercentage?: number | null;

  constructor(element: Element) {
    this.target = element;
    this.isObserving = false;
  }

  public observe = (
    callback: (percentage: number | null, current: HTMLElement) => void,
    options: MutationObserverInit
  ) => {
    this.observer = new MutationObserver((mutations) => {
      const current = mutations[mutations.length - 1]?.target as HTMLElement;
      const percentage = this.getPercentage(current);
      if (this.currentPercentage === percentage) {
        return;
      }
      this.currentPercentage = percentage;
      callback(percentage, current);
    });
    this.observer.observe(this.target, options);
    this.isObserving = true;
  };

  public unobserve = () => {
    this.observer?.disconnect();
    this.isObserving = false;
  };

  private getPercentage = (current: HTMLElement): number | null => {
    try {
      const percentage = Number(current.getAttribute('aria-valueNow'));
      if (isNaN(percentage)) {
        throw Error(`${percentage} is not a number`);
      }
      return percentage;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
}

export default Progress;
