/**
 * Generates a unique ID using a combination of timestamp and random string
 * @returns {string} A unique ID string
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
};
