import Session from '../../domain/entities/Session';

export interface AuthRepository {
    login(username: string, password: string): Promise<Session>;
}
