import { Method, Route } from '../http-server';

export const GET = (options: MethodOptions) => {
  return (target: unknown, handler: string): any => defineRoutes(target, 'GET', options.url, handler);
};

export const POST = (options: MethodOptions) => {
  return (target: unknown, handler: string): any => defineRoutes(target, 'POST', options.url, handler);
};

export const PUT = (options: MethodOptions) => {
  return (target: unknown, handler: string): any => defineRoutes(target, 'PUT', options.url, handler);
};

export const PATCH = (options: MethodOptions) => {
  return (target: unknown, handler: string): any => defineRoutes(target, 'PATCH', options.url, handler);
};

export const DELETE = (options: MethodOptions) => {
  return (target: unknown, handler: string): any => defineRoutes(target, 'DELETE', options.url, handler);
};

export const OPTIONS = (options: MethodOptions) => {
  return (target: unknown, handler: string): any => defineRoutes(target, 'OPTIONS', options.url, handler);
};

export const HEAD = (options: MethodOptions) => {
  return (target: unknown, handler: string): any => defineRoutes(target, 'HEAD', options.url, handler);
};

function defineRoutes(target: any, method: Method, url: string, handler: string) {
  const route: Route = { method, url, handler };

  if (target.routes) {
    target.routes = [...target.routes, route];
  } else {
    Object.defineProperty(target, 'routes', {
      get(): Route[] {
        return this._routes ?? [];
      },
      set(routes) {
        this._routes = routes;
      },
      configurable: true,
    });
    target.routes = [route];
  }
}

export interface MethodOptions {
  url: string;
}
