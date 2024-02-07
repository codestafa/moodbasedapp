import { fetchSpotify } from './fetchSpotify';

global.fetch = jest.fn();
jest.spyOn(global, 'fetch').mockImplementation(
  (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _input: RequestInfo | URL,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _init?: RequestInit | undefined,
  ): Promise<Response> => {
    return new Promise(resolve => {
      // @ts-expect-error this is a test
      resolve({
        json: () =>
          Promise.resolve({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data: 'foo',
          } as unknown as Response),
      });
    });
  },
);

describe('fetchSpotify', () => {
  it('calls `fetch` with the correct argument', async () => {
    const foo = 'foo';
    await fetchSpotify({ url: foo, init: foo as RequestInit });
    expect(fetch).toHaveBeenCalledWith(foo, foo);
  });
});
