import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    // in order to create a secure password in the database, we have to utilize two algorithms: salting and password hashing
    const saltRounds = 10;
    const hash: string = await bcrypt.hash(password, saltRounds);
    return hash;
};

export const comparePassword = async (enteredPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
}
