import { User, UserId } from '../../domain/user';

export interface UserRepository {
    getUser: (id: UserId) => Promise<User>;
}
