import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";
import { getUserTokenResponse } from "../../hangman/token/userTokenResponse";
import { useAuthState } from "../globalStores/useAuthStore";

const useAuthGuard = <T,>(Component: React.FunctionComponent<T>) =>
    observer((hocProps: T) => {
        const router = useRouter();
        const { authState, setUserAuth } = useAuthState();

        const checkIfTokenStillExists = () => {
            const token = getUserTokenResponse();
            setUserAuth({token});
            if (!token && router.pathname !== "/") {
                router.push({
                    pathname: "/",
                    query: {
                        returnUrl: router.asPath,
                    },
                });
            }
        };

        const authenticationWatcher = () => {
            const timer = setInterval(checkIfTokenStillExists, 2000);
            return () => clearInterval(timer);
        };


        React.useEffect(authenticationWatcher, []);

        return <Component {...hocProps} />;
    });

export default useAuthGuard;
