import { getErrorDetail } from '.';

describe('get-error-detail', () => {
  // Processes stack traces from Error objects correctly
  it('should process stack traces from Error objects correctly', () => {
    const error = new Error('Test error');
    error.stack =
      'Error: Test error\n    at /src/test/file.js:10:15\n    at /src/test/anotherFile.js:20:25';
    const result = getErrorDetail(error);
    expect(result).toBe('Error: Test error -> src/test/file.js:10:15');
  });

  // Handles empty string input gracefully
  it('should return default message when input is an empty string', () => {
    const result = getErrorDetail('');
    expect(result).toBe('');
  });
});
