import axios from "axios";
import { useQuery, useMutation, useInfiniteQuery } from "react-query";
import { getUserTokenResponse, removeUserTokenResponse } from "./token/userTokenResponse";

const apiRoutes = {
    proxySignIn: "/api/signin",
    signUp: "/users/create",
    createMatch: "/matches/create",
    updateMatch: "/matches/update",
    words: "/words",
    matches: "/matches",
};

//Initialize axios
export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URI}/freeman-hangman`,
});

//Access token interceptor
axiosInstance.interceptors.request.use(async (request) => {
    const accessToken = getUserTokenResponse();
    if (accessToken) {
        request.headers = {
            Authorization: `Bearer ${accessToken}`,
        };
    }
    return request;
});

//Error response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            error.response.status === 500 &&
            error?.response?.data.exception === "BadCredentialsException"
        ) {
            removeUserTokenResponse();
        }
        Promise.reject(error?.response?.data);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            removeUserTokenResponse();
        }
        Promise.reject(error?.response?.data);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            removeUserTokenResponse();
        }
    }
);

//Proxy axios instance for login
export const proxyAxiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

export type APIResponse = {
    status: string;
    message: string;
};

//Auth
export type Auth = {
    email: string;
    password: string;
};

export type AuthResponse = {
    payload: string;
};

export type User = {
    name: string;
    email: string;
    password: string;
};

//Sign in
const signIn = async (auth: Auth): Promise<AuthResponse> =>
    await proxyAxiosInstance.post(apiRoutes.proxySignIn, auth).then((res) => res.data);

export const useSignIn = ({ onSuccess, onError, onSettled }: MutationProps) =>
    useMutation((auth: Auth) => signIn(auth), {
        onError: onError,
        onSuccess: onSuccess,
        onSettled: onSettled,
    });

//Sign up
const createUser = async (payload: User): Promise<APIResponse> =>
    await axiosInstance.post(apiRoutes.signUp, payload).then((res) => res.data);

export const useCreateUser = ({ onSuccess, onError, onSettled }: MutationProps) =>
    useMutation((payload: User) => createUser(payload), {
        onError: onError,
        onSuccess: onSuccess,
        onSettled: onSettled,
    });

export declare module CreateMatch {
    export interface Payload {
        userId: number;
        wordId: number;
        userEnteredInputs: string;
        chancesLeft: number;
        score: number;
        id: number;
    }

    export interface Response {
        status: string;
        payload: Payload;
    }
}

//Create match
const createMatch = async (): Promise<CreateMatch.Response> =>
    await axiosInstance.post(apiRoutes.createMatch, {}).then((res) => res.data);

export const useCreateMatch = ({ onSuccess, onError, onSettled }: MutationProps) =>
    useMutation(createMatch, {
        onError: onError,
        onSuccess: onSuccess,
        onSettled: onSettled,
    });

//Paginated Matches
export declare module PaginatedMatches {
    export interface Match {
        userId: string;
        wordId: number;
        userEnteredInputs: string;
        chancesLeft: number;
        score: number;
        status: string;
        id: number;
        createdAt: Date;
    }

    export interface Payload {
        pageNumber: number;
        pageSize: number;
        totalElements: number;
        elements: Match[];
        totalPages: number;
        lastPage: boolean;
        firstPage: boolean;
    }

    export interface MatchesResponse {
        status: string;
        payload: Payload;
    }
}

const fetchMatches = async ({ pageParam = `${apiRoutes.matches}/0/10` }) => {
    const response = await axiosInstance
        .get<PaginatedMatches.MatchesResponse>(pageParam)
        .then((res) => res.data);
    const {
        payload: { pageNumber, lastPage },
    } = response;
    const nextPage = lastPage ? null : `${apiRoutes.matches}/${pageNumber + 1}/10`;
    return { response, nextPage };
};

export const useMatches = () =>
    useInfiniteQuery("matches", fetchMatches, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
    });

//Single Match
declare module SingleMatch {
    export interface Match {
        userId: string;
        wordId: number;
        userEnteredInputs: string;
        chancesLeft: number;
        score: number;
        status: string;
        id: number;
        createdAt: Date;
    }

    export interface MatchResponse {
        status: string;
        payload: Match;
    }
}

const fetchMatch = async (match?: number): Promise<SingleMatch.MatchResponse> =>
    await axiosInstance.get(`${apiRoutes.matches}/${match}`).then((res) => res.data);

export const useMatch = (match?: number) =>
    useQuery(["match", match], () => fetchMatch(match), {
        enabled: !!match,
    });

//Words
export declare module Words {
    export interface Word {
        word: string;
        id: number;
        createdAt: Date;
    }

    export interface WordReponse {
        status: string;
        payload: Word;
    }
}

const fetchWord = async (word?: number): Promise<Words.WordReponse> =>
    await axiosInstance.get(`${apiRoutes.words}/${word}`).then((res) => res.data);

export const useWord = (word?: number) =>
    useQuery(["word", word], () => fetchWord(word), {
        enabled: !!word,
    });

//Match playing
type MutationProps = {
    onError?: (error?: any) => void;
    onSuccess?: () => void;
    onSettled?: () => void;
};
export interface MatchUpdatePayload {
    guessedLetter: string;
    id?: number;
}
const updateMatch = async (payload: MatchUpdatePayload) =>
    await axiosInstance.put(apiRoutes.updateMatch, payload).then((res) => res.data);

export const useMatchUpdate = ({ onSuccess, onError, onSettled }: MutationProps) =>
    useMutation((payload: MatchUpdatePayload) => updateMatch(payload), {
        onError: onError,
        onSuccess: onSuccess,
        onSettled: onSettled,
    });
