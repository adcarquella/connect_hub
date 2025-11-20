// src/tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  rest.get('http://localhost:3000/api/hello', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Hello World' }));
  })
);
