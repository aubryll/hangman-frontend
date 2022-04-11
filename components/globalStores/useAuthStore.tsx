import { action, observable } from "mobx";
import * as React from "react";
import { getUserTokenResponse } from "../../hangman/token/userTokenResponse";

export type AuthStore = {
    token?: String;
};

const store = observable({
    authState: {
        token: getUserTokenResponse(),
    } as AuthStore,
    setUserAuth: action((state: AuthStore) => (store.authState.token = state.token)),
});

const context = React.createContext(store);
export const useAuthState = () => React.useContext(context);
