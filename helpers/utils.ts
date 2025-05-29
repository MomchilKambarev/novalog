/**
 * Generates a random delay between 0 and max seconds
 * @param max - Maximum delay in seconds
 * @returns Promise that resolves after the random delay
 */
export const delay = async (seconds: number) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const randomNumber = () => {
  return Math.floor(Math.random() * 100);
};
