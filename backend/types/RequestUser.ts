import { type Request } from 'express';
import type User from './User.ts';

export default interface RequestUser extends Request {
    user?: User;
}