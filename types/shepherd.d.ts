declare module "shepherd.js" {
  export interface ShepherdTourOptions {
    defaultStepOptions?: {
      classes?: string;
      scrollTo?: boolean;
    };
  }

  export interface ShepherdStepOptions {
    id: string;
    text: string;
    attachTo: {
      element: string;
      on: string;
    };
    buttons: Array<{
      text: string;
      action: () => void;
    }>;
  }

  export class Tour {
    constructor(options?: ShepherdTourOptions);
    addStep(options: ShepherdStepOptions): this;
    start(): void;
    complete(): void;
    next(): void;
  }

  export default {
    Tour: Tour,
  };
}
