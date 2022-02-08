import fastify, {
  ContextConfigDefault,
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { HTTPServerError } from './http-server-error';

export class HTTPServer {
  private readonly server: FastifyInstance;
  public readonly port: HTTPServerOptions['port'];
  public readonly routes: Map<new () => any, Route[]>;

  constructor(options: HTTPServerOptions) {
    const { port, controllers } = options;

    this.server = fastify();
    this.port = port;
    this.routes = new Map();

    if (typeof controllers === 'string') {
      // TODO
    } else if (Array.isArray(controllers)) {
      controllers.map((controller) => {
        const { baseURL } = controller as unknown as { baseURL: string };
        const instance = new controller();

        this.routes.set(
          controller,
          instance.routes.reduce((acc: Route[], route) => {
            const url = `${baseURL}${route.url}`;

            this.server[route.method.toLowerCase()](url, (req: Request, res: Response) =>
              instance[route.handler](req, res),
            );

            acc.push({ ...route, url });
            return acc;
          }, []),
        );
      });
    } else {
      throw new TypeError('Unsupported type of controllers');
    }
  }

  public async run(): Promise<void> {
    await this.server.listen(this.port);
  }

  public async stop(): Promise<void> {
    await this.server.close();
  }

  public setErrorHandler(handler: (error: HTTPServerError | FastifyError, req: Request, res: Response) => void): this {
    this.server.setErrorHandler(handler);
    return this;
  }
}

export interface HTTPServerOptions {
  port: number;
  controllers: string | Array<new () => any>;
}

export interface Route {
  method: Method;
  url: string;
  handler: string;
}

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export type Handler = (req: Request, res: Response) => void;

export type Request<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
> = FastifyRequest<RouteGeneric, RawServer, RawRequest>;
export type Response<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
> = FastifyReply<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig>;
