const { validateDate } = require('../../utils/validation');

describe('Date Validation', () => {

  test('should accept valid date', () => {
    expect(() => validateDate('2024-01-01')).not.toThrow();
  });

  test('should reject invalid date format', () => {
    expect(() => validateDate('abc')).toThrow();
  });

  test('should reject invalid calendar date', () => {
    expect(() => validateDate('2024-99-99')).toThrow();
  });

});
