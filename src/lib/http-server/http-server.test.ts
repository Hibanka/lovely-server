import axios from 'axios';
import { expect } from 'chai';
import { Controller, GET, Request, Response, POST, HTTPServer } from '../../../src';

@Controller({ url: '/user' })
export class UserController {
  @GET({ url: '/avatar' })
  public async getAvatarHandler(req: Request, res: Response): Promise<void> {
    res.status(200).send('OK');
  }

  @POST({ url: '/avatar' })
  public async createAvatarHandler(
    req: Request<{ Body: { id: string } }>,
    res: Response,
  ): Promise<void> {
    const { id } = req.body;
    res.status(201).send(`Created ${id}`);
  }

  @GET({ url: '/nickname' })
  public async getNicknameHandler(req: Request, res: Response): Promise<void> {
    res.status(200).send('OK');
  }
}

describe('http-server', () => {
  const port = 9999;
  const fetch = axios.create({ baseURL: `http://localhost:${port}` });

  it('Manual routes', async () => {
    const server = new HTTPServer({ port, controllers: [UserController] });

    server.setErrorHandler((error) => console.error(error));

    await server.run();

    expect(server.port).eql(port);

    expect(server.routes.get(UserController)).eql([
      { method: 'GET', url: '/user/avatar', handler: 'getAvatarHandler' },
      { method: 'POST', url: '/user/avatar', handler: 'createAvatarHandler' },
      { method: 'GET', url: '/user/nickname', handler: 'getNicknameHandler' },
    ]);

    await Promise.all([
      fetch.get('/user/avatar').then(({ data }) => expect(data).eql('OK')),
      fetch.post('/user/avatar', { id: 'id' }).then(({ data }) => expect(data).eql('Created id')),
      fetch.get('/user/nickname').then(({ data }) => expect(data).eql('OK')),
    ]);

    await server.stop();
  });
});
