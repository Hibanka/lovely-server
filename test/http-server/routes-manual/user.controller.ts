import { Controller, GET, Request, Response, POST } from '../../../src';

@Controller({ route: '/user' })
export class UserController {
  @GET({ url: '/avatar' })
  public async getAvatarHandler(req: Request, res: Response): Promise<void> {
    res.status(200).send('OK');
  }

  @POST({ url: '/avatar' })
  public async createAvatarHandler(req: Request<{ Body: { id: string } }>, res: Response): Promise<void> {
    const { id } = req.body;

    this.getUsers();

    res.status(201).send(`Created ${id}`);
  }

  @GET({ url: '/nickname' })
  public async getNicknameHandler(req: Request, res: Response): Promise<void> {
    res.status(200).send('OK');
  }

  private getUsers(): string[] {
    return ['Jon', 'Elon'];
  }
}
