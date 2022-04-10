import fastify, {
  ContextConfigDefault,
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  FastifySchemaCompiler,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteShorthandOptions,
} from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { HTTPServerError } from './http-server-error';

export class HTTPServer {
  private readonly server: FastifyInstance;
  public readonly port: number;
  public readonly routes: Map<new () => any, Route[]>;

  constructor(options: HTTPServerOptions) {
    const { port, controllers } = options;

    this.server = fastify();
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

          this.server[method](url, options, (req: Request, res: Response) =>
            instance[handler](req, res),
          );

          acc.push({ ...route, url });
          return acc;
        }, []),
      );
    });
  }

  public async run(): Promise<void> {
    await this.server.listen(this.port);
  }

  public async stop(): Promise<void> {
    await this.server.close();
  }

  public setErrorHandler(
    handler: (error: HTTPServerError | FastifyError, req: Request, res: Response) => void,
  ): this {
    this.server.setErrorHandler(handler);
    return this;
  }

  public setValidatorCompiler<T = FastifySchema>(schemaCompiler: FastifySchemaCompiler<T>): this {
    this.server.setValidatorCompiler(schemaCompiler);
    return this;
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
