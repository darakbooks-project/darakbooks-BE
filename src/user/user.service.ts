import { Injectable } from '@nestjs/common';
export type User = any;

@Injectable()
export class UserService {
    private readonly users = [];
    async findOne(username: string) : Promise<User|undefined>{
        return this.users.find(user => user.username === username);
    }
}
