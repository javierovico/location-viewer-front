import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {ERROR_CODE_NO_AUTENTICADO, ERROR_CODE_NO_VALIDO, ERROR_CODE_SIN_ACCESO_SSO} from "../settings/constant";
import openNotification from "../components/UI/Antd/Notification";
import IUsuario, {UsuarioResponse, TokenUsuarioResponse, URL_DESCARGA_USUARIO, URL_LOGIN} from "../modelos/Usuario";
import ResponseAPI from "../modelos/ResponseAPI";

interface AuthValues {
    loggedIn: boolean,
    logOut: () => void,
    signIn: (authValues: SignInParams) => Promise<void>,
    user: IUsuario | null,
    token: string | null,
    analizarError: (e: any) => void,
}

const authValues: AuthValues = {
    loggedIn: false,
    logOut: () => {
    },
    signIn: () => new Promise((resolve, reject) => {
        reject("Not Implemented yet")
    }),
    user: null,
    token: null,
    analizarError: () => {
    },
}

interface SignInParams {
    user: string,
    password: string,
}

export const AuthContext = React.createContext<AuthValues>(authValues);

const addItem = (key: string, value = '') => {
    if (key) localStorage.setItem(key, value);
};

const clearItem = (key: string) => {
    localStorage.removeItem(key);
};

const isValidToken = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? token : null;
}

const AuthProvider = (props: any) => {
    const [loggedIn, setLoggedIn] = useState(isValidToken());
    const [user, setUser] = useState<IUsuario | null>(null);
    const [token, setToken] = useState(getToken);

    /** Establece el token en el axio*/
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        } else {
            axios.defaults.headers.common['Authorization'] = '';
        }
    }, [token])


    const signIn = useCallback((params: SignInParams) => {
        return new Promise<void>((resolve) => {
            axios.post<ResponseAPI<TokenUsuarioResponse>>(URL_LOGIN, params).then(({data}) => {
                setToken((data.data.token))
                addItem('token', data.data.token)
                setLoggedIn(true)
                resolve()
            })
        });
    }, [])


    const logOut = useCallback(() => {
        setUser(null);
        setToken(null);
        clearItem('token');
        setLoggedIn(false);
    }, []);

    /** Si se deslogguea o se loguea, acutliza los datos del usuario logueado */
    useEffect(() => {
        if (loggedIn) {
            axios.get<ResponseAPI<UsuarioResponse>>(URL_DESCARGA_USUARIO).then(({data}) => {
                setUser(data.data.usuario)
            }).catch(() => {
                /** Fallo en el logueo*/
                logOut()
            })
        }
    }, [logOut, loggedIn])
    const analizarError = useCallback(error => {
        openNotification(error);
        switch (error?.response?.data?.errorCode) {
            case ERROR_CODE_NO_AUTENTICADO:
            case ERROR_CODE_SIN_ACCESO_SSO:
            case ERROR_CODE_NO_VALIDO:
                logOut()
                break;
            default:
                break;
        }
    }, [logOut]);

    return (
        <AuthContext.Provider
            value={{
                loggedIn,
                logOut,
                signIn,
                user,
                token,
                analizarError,
            }}
        >
            <>{props.children}</>
        </AuthContext.Provider>
    );
};

export default AuthProvider;
