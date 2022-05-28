import fastify, {
  ContextConfigDefault,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteShorthandOptions,
} from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';

export class HTTPServer {
  public readonly fastify: FastifyInstance;
  public readonly port: number;
  public readonly routes: Map<new () => any, Route[]>;

  constructor(options: HTTPServerOptions) {
    const { port, controllers } = options;

    this.fastify = fastify();
    this.port = port;
    this.routes = new Map();

    controllers.forEach((controller) => {
      const { baseURL } = controller as unknown as { baseURL: string };
      const instance = new controller();

      this.routes.set(
        controller,
        instance.routes.reduce((acc: Route[], route: Route) => {
          const method = route.method.toLowerCase();
          const url = baseURL + route.url;
          const { handler, ...options } = route;

          this.fastify[method](url, options, (req: Request, res: Response) => instance[handler](req, res));

          acc.push({ ...route, url });
          return acc;
        }, []),
      );
    });
  }

  public async run(): Promise<void> {
    await this.fastify.listen(this.port);
  }

  public async stop(): Promise<void> {
    await this.fastify.close();
  }
}

export interface HTTPServerOptions {
  port: number;
  controllers: Array<new () => any>;
}

export interface RouteOptions<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  SchemaCompiler = FastifySchema,
> extends RouteShorthandOptions<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    ContextConfig,
    SchemaCompiler
  > {
  url: string;
}

interface Route extends RouteOptions {
  method: string;
  handler: string;
}

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
