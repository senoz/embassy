export class Users {
    id: string;
    email: string;
    name?: string;
    userName: string;
    password: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    wallet: number;
    refferedBy: string;
    token?: string;
}
