import { Controller, RouteController, GET, HTTPServerRequest, HTTPServerResponse, POST } from '../../../src';

@Controller({ route: '/user' })
export class UserController extends RouteController {
  @GET({ url: '/avatar' })
  public async getAvatarHandler(req: HTTPServerRequest, res: HTTPServerResponse): Promise<void> {
    res.status(200).send('OK');
  }

  @POST({ url: '/avatar' })
  public async createAvatarHandler(
    req: HTTPServerRequest<{ Body: { id: string } }>,
    res: HTTPServerResponse,
  ): Promise<void> {
    const { id } = req.body;

    this.getUsers();

    res.status(201).send(`Created ${id}`);
  }

  @GET({ url: '/nickname' })
  public async getNicknameHandler(req: HTTPServerRequest, res: HTTPServerResponse): Promise<void> {
    res.status(200).send('OK');
  }

  private getUsers(): string[] {
    return ['Jon', 'Elon'];
  }
}
