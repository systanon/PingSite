import { describe, expect, test } from '@jest/globals';
import { validateUrl } from "../src/validation";


describe('Validation url', () => {
  test.each([
    ['https://jsonplaceholder.typicode.com/todos/1', 'https://jsonplaceholder.typicode.com/todos/1'],
    ['https://jsonplaceholder.typicode.com/todos/5,', 'https://jsonplaceholder.typicode.com/todos/5'],
    ['http://jsonplaceholder.typicode.com/todos/5', 'http://jsonplaceholder.typicode.com/todos/5'],
  ])('It will return a valid URL for %s', (url,expected) => {
    expect(validateUrl(url)).toBe(expected)
  });
  test.each([
    ['https:/jsonplaceholder.typicode.com/todos/1'],
    ['http//jsonplaceholder.typicode.com/todos/5,'],
    ['ttp://jsonplaceholder.typicode.com/todos/5'],
  ])('It will throw an error for an invalid URL: %s', (url) => {
    expect(() => validateUrl(url)).toThrow('This is not valid url');
  });
});
