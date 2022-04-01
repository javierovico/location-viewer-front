export default class Usuario implements IUsuario{
    id: number;
    nombre: string;
    user: string;

    constructor(obj: IUsuario) {
        this.id = obj.id;
        this.nombre = obj.nombre;
        this.user = obj.user;
    }
}

const URL_DESCARGA_USUARIO: string = `/auth/user`;
const URL_LOGIN: string = '/auth/login';

interface IUsuario {
    user: string,
    nombre: string,
    id: number,
}

interface TokenUsuarioResponse {
    readonly expires: string,
    readonly token: string,
    readonly type: string,
}

interface UsuarioResponse {
    readonly usuario: IUsuario
}

export {URL_DESCARGA_USUARIO, URL_LOGIN};
export type { TokenUsuarioResponse, UsuarioResponse, IUsuario};

