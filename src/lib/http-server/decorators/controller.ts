export const Controller = (options: ControllerOptions) => {
  return (target: unknown): any => {
    Object.defineProperty(target, 'baseURL', {
      get(): string {
        return options.route;
      },
    });
  };
};

export interface ControllerOptions {
  route: string;
}
