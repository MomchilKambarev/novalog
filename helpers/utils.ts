/**
 * Generates a random delay between 0 and max seconds
 * @param max - Maximum delay in seconds
 * @returns Promise that resolves after the random delay
 */
export const randomDelay = async (max: number) => {
  await new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max * 1000)))
  );
};
