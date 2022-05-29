export class HttpException extends Error {
  public statusCode: number;
  public body: string | object;

  constructor(statusCode: number, body: string | object) {
    super('HttpException');
    this.statusCode = statusCode;
    this.body = body;
  }
}

export { FastifyError } from 'fastify';
