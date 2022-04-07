import axios from "axios";
import { useQuery, useMutation, useInfiniteQuery } from "react-query";

//Initialize axios
export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URI}/freeman-hangman`,
});

//Auth
export type Auth = {
    username: string;
    password: string;
};

export type User = {
    fName: string;
    lName: string;
    email: string;
    password: string;
};

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

const fetchMatches = async ({ pageParam = "/matches/0/10" }) => {
    const response = await axiosInstance
        .get<PaginatedMatches.MatchesResponse>(pageParam)
        .then((res) => res.data);
    const {
        payload: { pageNumber, lastPage },
    } = response;
    const nextPage = lastPage ? null : `/matches/${pageNumber + 1}/10`;
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
    await axiosInstance.get(`/matches/${match}`).then((res) => res.data);

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
    await axiosInstance.get(`/words/${word}`).then((res) => res.data);

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
    userId: string;
    guessedLetter: string;
    id?: number;
}
const updateMatch = async (payload: MatchUpdatePayload) =>
    await axiosInstance.put("/matches/update", payload).then((res) => res.data);

export const useMatchUpdate = ({ onSuccess, onError, onSettled }: MutationProps) =>
    useMutation((payload: MatchUpdatePayload) => updateMatch(payload), {
        onError: onError,
        onSuccess: onSuccess,
        onSettled: onSettled,
    });
