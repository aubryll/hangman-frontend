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
}


//Matches
export declare module Matches {
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

const fetchMatches = async({pageParam = "/matches/0/10"}) => {
        const response = await axiosInstance.get<Matches.MatchesResponse>(pageParam)
        .then((res) => res.data);
        const {payload: {pageNumber, lastPage}} = response;
        const nextPage = lastPage ? null : `/matches/${pageNumber + 1}/10`;
        return {response, nextPage}
}

export const useMatches = () => useInfiniteQuery("matches", fetchMatches, {
            getNextPageParam: (lastPage) => lastPage.nextPage,
        })


