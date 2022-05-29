export const Controller = (options: ControllerOptions) => {
  return (target: unknown): any => {
    Object.defineProperty(target, 'baseURL', {
      get() {
        return options.url;
      },
    });
  };
};

export interface ControllerOptions {
  url: `/${string}`;
}
