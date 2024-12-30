import bcrypt from "bcrypt";

// function for hashing password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Jumlah putaran untuk salt
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to compare password
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
