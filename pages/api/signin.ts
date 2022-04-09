import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { body } = req;

    try {
        const { data, status } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URI}/freeman-hangman/auth/signin`,
            body
        );
        res.status(status).json(data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            res.status(status).json(data);
        } else {
            res.status(500).send({
                error_description: "Unknown error occurred, try again",
            });
        }
    }
};
