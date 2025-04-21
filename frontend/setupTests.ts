import '@testing-library/jest-dom';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({}) })
  ) as jest.Mock;
});
