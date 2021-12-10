import fastify, {
  ContextConfigDefault,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
} from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';

export class HTTPServer {
  private readonly server: FastifyInstance;
  public readonly port: HTTPServerOptions['port'];
  public readonly routes: Map<new () => RouteController, HTTPServerRoute[]>;

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
          instance.routes.reduce((acc: HTTPServerRoute[], route) => {
            const url = `${baseURL}${route.url}`;

            this.server[route.method.toLowerCase()](url, (req: HTTPServerRequest, res: HTTPServerResponse) =>
              instance[route.handler](req, res),
            );

            acc.push({ ...route, url });
            return acc;
          }, []),
        );
      });
    } else {
      throw new Error('Unsupported type of controllers');
    }
  }

  public async run(): Promise<void> {
    await this.server.listen(this.port);
  }

  public async stop(): Promise<void> {
    await this.server.close();
  }

  public printRoutes(): string {
    return this.server.printRoutes();
  }
}

export interface HTTPServerOptions {
  port: number;
  controllers: string | Array<new () => RouteController>;
}

export abstract class RouteController {
  public routes: HTTPServerRoute[];
}

export interface HTTPServerRoute {
  method: HTTPServerMethod;
  url: string;
  handler: string;
}

export type HTTPServerMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type HTTPServerHandler = (req: HTTPServerRequest, res: HTTPServerResponse) => void;

export type HTTPServerRequest<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
> = FastifyRequest<RouteGeneric, RawServer, RawRequest>;
export type HTTPServerResponse<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
> = FastifyReply<RawServer, RawRequest, RawReply, RouteGeneric, ContextConfig>;
