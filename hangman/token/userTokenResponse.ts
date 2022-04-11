import Cookies from "js-cookie";

const TOKEN_KEY = "userAccessToken";

export const getUserTokenResponse = (): String | undefined => Cookies.get(TOKEN_KEY);

export const setUserTokenResponse = (token: String) => {
    const cookieOptions = {
        expires: 604800,
    };

    Cookies.set(TOKEN_KEY, token, cookieOptions);
};

export const removeUserTokenResponse = () => {
    Cookies.remove(TOKEN_KEY);
};
