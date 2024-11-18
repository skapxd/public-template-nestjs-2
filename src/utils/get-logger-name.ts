export const getLoggerName = (str: string) => {
  const name = str.replaceAll('\\', '/').split('/').pop() ?? '';
  return name;
};
