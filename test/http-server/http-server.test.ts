import { describe, it } from 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { HTTPServer } from '../../src';
import { UserController } from './routes-manual/user.controller';

describe('http-server', () => {
  const PORT = 7557;
  const fetch = axios.create({ baseURL: `http://localhost:${PORT}` });

  it('Manual routes', async () => {
    const server = new HTTPServer({
      port: PORT,
      controllers: [UserController],
    });

    server.setErrorHandler((error) => console.error(error));

    await server.run();

    expect(server.port).eq(PORT);

    expect(server.routes.get(UserController)).eql([
      { method: 'GET', url: '/user/avatar', handler: 'getAvatarHandler' },
      { method: 'POST', url: '/user/avatar', handler: 'createAvatarHandler' },
      { method: 'GET', url: '/user/nickname', handler: 'getNicknameHandler' },
    ]);

    await Promise.all([
      fetch.get('/user/avatar').then((res) => expect(res.data).eq('OK')),
      fetch.post('/user/avatar', { id: 'id' }).then((res) => expect(res.data).eq('Created id')),
      fetch.get('/user/nickname').then((res) => expect(res.data).eq('OK')),
    ]);

    await server.stop();
  });
});
