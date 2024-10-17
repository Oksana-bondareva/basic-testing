// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const baseURL = 'https://jsonplaceholder.typicode.com';
const mockData = { id: 1, name: 'John Doe' };

beforeAll(() => {
  jest.useFakeTimers();
});

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  let mockAxiosCreate: jest.Mock;
  let mockAxiosGet: jest.Mock

  beforeEach(() => {
    mockAxiosGet = jest.fn().mockResolvedValue({ data: mockData });
    mockAxiosCreate = jest.fn().mockImplementation(() => {
      return {
        get: mockAxiosGet,
        defaults: {},
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
        getUri: jest.fn(),
        request: jest.fn(),
        delete: jest.fn(),
        head: jest.fn(),
        options: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
      };
    });
    axios.create = mockAxiosCreate;
    jest.clearAllMocks();
  });

  test('should create instance with provided base URL', async () => {
    await throttledGetDataFromApi('/users');
    jest.runAllTimers();
    expect(mockAxiosCreate).toHaveBeenCalledWith({
      baseURL,
    });
  });

  test('should perform request to correct provided URL', async () => {
    await throttledGetDataFromApi('/users');
    jest.runAllTimers();
    expect(mockAxiosGet).toHaveBeenCalledWith('/users');
  });

  test('should return response data', async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: mockData });
    const result = await throttledGetDataFromApi('/users/1');
    jest.runAllTimers();
    expect(result).toEqual(mockData);
  });
});
