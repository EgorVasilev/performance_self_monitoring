import {GetUserQuery} from "../../../../port/in/query/query";
import {UserRepository} from "../../../../port/out/userRepository";
import {UserId} from "../../../../domain/user";


export const getUser = (repository: UserRepository): GetUserQuery => (id: UserId) => repository.getUser(id)