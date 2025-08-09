import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
    // in order to create a secure password in the database, we have to utilize two algorithms: salting and password hashing
    const saltRounds = 10;
    const hash: string = await bcrypt.hash(password, saltRounds);
    return hash;
};

export default hashPassword;