import argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  return await argon2.hash(password, {
    type: argon2.argon2id, // Use Argon2id for best security
    memoryCost: 65536, // Prevent GPU attacks
    timeCost: 3, // Increase computation time
    parallelism: 2, // Adjust based on system performance
  });
};

export const verifyPassword = async (
  passwordHash: string,
  password: string
): Promise<boolean> => {
  return await argon2.verify(passwordHash, password);
};
