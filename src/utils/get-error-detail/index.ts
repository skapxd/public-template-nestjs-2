const processStack = (str: string) =>
  str
    .replace(/\\/g, '/')
    .split('\n')
    .map((line) => line.trim())
    .map((line) => line.replace(/.*\/src/g, 'src'))
    .map((line) => (line.startsWith('(') ? line.substring(1) : line))
    .map((line) => (line.endsWith(')') ? line.slice(0, -1) : line))
    .slice(0, 2)
    .join(' -> ');

export const getErrorDetail = (exception: Error | string) => {
  if (exception instanceof Error) {
    const errorDetail = processStack(exception.stack ?? '');

    return errorDetail ?? 'default message';
  }

  if (typeof exception === 'string') {
    const errorDetail = processStack(exception);

    return errorDetail ?? 'default message';
  }
};
