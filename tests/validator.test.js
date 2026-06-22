import { isEmail, isPhone, isNonEmpty, isInRange } from '../src/utils/validator';

describe('isEmail', () => {
  test('valid email', () => expect(isEmail('user@example.com')).toBe(true));
  test('missing @', () => expect(isEmail('userexample.com')).toBe(false));
  test('empty string', () => expect(isEmail('')).toBe(false));
});

describe('isPhone', () => {
  test('valid phone', () => expect(isPhone('13800138000')).toBe(true));
  test('too short', () => expect(isPhone('1380013800')).toBe(false));
  test('wrong prefix', () => expect(isPhone('12345678901')).toBe(false));
});

describe('isNonEmpty', () => {
  test('non-empty string', () => expect(isNonEmpty('hello')).toBe(true));
  test('whitespace only', () => expect(isNonEmpty('   ')).toBe(false));
  test('null', () => expect(isNonEmpty(null)).toBe(false));
});

describe('isInRange', () => {
  test('within range', () => expect(isInRange(5, 1, 10)).toBe(true));
  test('out of range', () => expect(isInRange(11, 1, 10)).toBe(false));
});
