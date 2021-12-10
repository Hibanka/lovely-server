import { describe } from 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { HTTPServer } from '../../src';
import { UserController } from './routes-manual/user.controller';

describe('HTTP Server tests', () => {
  const PORT = 7557;
  const fetch = axios.create({ baseURL: `http://localhost:${PORT}` });

  it('Manual routes', async () => {
    const server = new HTTPServer({
      port: PORT,
      controllers: [UserController],
    });

    await server.run();

    expect(server.port).eq(PORT);

    expect(server.routes.get(UserController)).eql([
      { method: 'GET', url: '/user/avatar', handler: 'getAvatarHandler' },
      { method: 'POST', url: '/user/avatar', handler: 'createAvatarHandler' },
      { method: 'GET', url: '/user/nickname', handler: 'getNicknameHandler' },
    ]);

    expect(server.printRoutes()).include('avatar (GET)').includes('avatar (POST)').includes('nickname (GET)');

    await Promise.all([
      fetch.get('/user/avatar').then((res) => expect(res.data).eq('OK')),
      fetch.post('/user/avatar', { id: 'test-id' }).then((res) => expect(res.data).eq('Created test-id')),
      fetch.get('/user/nickname').then((res) => expect(res.data).eq('OK')),
    ]);

    await server.stop();
  });
});
