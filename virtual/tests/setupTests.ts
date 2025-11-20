import '@testing-library/jest-dom';
// polyfill fetch/Response/Request for Node
import 'whatwg-fetch';

import { server } from './mocks/server';

// Start MSW before all tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
