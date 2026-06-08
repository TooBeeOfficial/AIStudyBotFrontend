export class UserModel {
    id!: number;
    name!: string;
    email!: string;

    static fromApi(data: any): UserModel {
        const user = new UserModel();

        user.id = data.id;
        user.name = data.name;
        user.email = data.email;

        return user;
    }
}