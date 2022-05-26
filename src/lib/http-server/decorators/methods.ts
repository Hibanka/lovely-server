import { RouteOptions } from '../http-server';

export const GET = (options: RouteOptions) => {
  return (target: unknown, handler: string): any =>
    defineRoutes(target, { method: 'GET', handler, ...options });
};

export const POST = (options: RouteOptions) => {
  return (target: unknown, handler: string): any =>
    defineRoutes(target, { method: 'POST', handler, ...options });
};

export const PUT = (options: RouteOptions) => {
  return (target: unknown, handler: string): any =>
    defineRoutes(target, { method: 'PUT', handler, ...options });
};

export const PATCH = (options: RouteOptions) => {
  return (target: unknown, handler: string): any =>
    defineRoutes(target, { method: 'PATCH', handler, ...options });
};

export const DELETE = (options: RouteOptions) => {
  return (target: unknown, handler: string): any =>
    defineRoutes(target, { method: 'DELETE', handler, ...options });
};

export const OPTIONS = (options: RouteOptions) => {
  return (target: unknown, handler: string): any =>
    defineRoutes(target, { method: 'OPTIONS', handler, ...options });
};

export const HEAD = (options: RouteOptions) => {
  return (target: unknown, handler: string): any =>
    defineRoutes(target, { method: 'HEAD', handler, ...options });
};

function defineRoutes(target: any, route: RouteOptions & { method: string; handler: string }): void {
  if (target.routes) {
    target.routes = [...target.routes, route];
  } else {
    Object.defineProperty(target, 'routes', {
      get() {
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
