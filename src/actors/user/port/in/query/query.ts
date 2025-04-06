import { User, UserId } from '../../../domain/user';

export type GetUserQuery = (id: UserId) => Promise<User>;
