import axios from "axios";
import { useQuery, useMutation } from "react-query";

//Initialize axios
export const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URI}/freeman-hangman`,
});


//Auth
export type Auth = {
    username: string;
    password: string;
};