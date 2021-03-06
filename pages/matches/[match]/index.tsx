import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
    Typography,
    Stack,
    Button,
    Box,
    Container,
    styled,
    AppBar,
    Toolbar,
    AlertColor,
} from "@mui/material";
import Image from "next/image";
import { useMatch, useMatchUpdate, useWord } from "../../../hangman/api";
import { useIsFetching, useIsMutating, useQueryClient } from "react-query";
import { green, red } from "@mui/material/colors";
import Snackbar from "../../../components/Snackbar";

const KeyboardButton = styled(Button)({
    boxShadow: "none",
    textTransform: "none",
    fontSize: "2.5rem",
    padding: "6px 12px",
    border: "1px solid",
    margin: "18px 8px 10px 13px",
    lineHeight: 1.5,
    backgroundColor: "#0063cc",
    width: "5rem",
    borderColor: "#0063cc",
    "&:hover": {
        backgroundColor: "#0069d9",
        borderColor: "#0062cc",
        boxShadow: "none",
    },
    "&:active": {
        boxShadow: "none",
        backgroundColor: "#0062cc",
        borderColor: "#005cbf",
    },
    "&:focus": {
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
});

const Match: NextPage<{}> = () => {
    const router = useRouter();
    const { match } = router.query;
    const [snackBar, setSnackBar] = useState<{
        open: boolean;
        message?: string;
        severity?: AlertColor;
    }>({ open: false });

    const queryClient = useQueryClient();

    const isFetching = useIsFetching();
    const isMutating = useIsMutating();

    //API
    const { data: apiMatch, error: matchError } = useMatch(Number(match));
    const { data: apiWord, error: wordError } = useWord(apiMatch?.payload.wordId);
    const { mutate } = useMatchUpdate({
        onSuccess(): void {
            queryClient.invalidateQueries("match");
        },
        onError(error?: any): void {
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "error",
                message: error.payload.message ?? "Error occurred, try again",
            });
        },
    });

    const handleGuess = (letter: string) => {
        mutate({
            guessedLetter: letter,
            id: apiMatch?.payload.id,
        });
    };

    const toggleSnackbar = () =>
        setSnackBar({
            ...snackBar,
            open: !snackBar.open,
        });

    const guessWord = () =>
        apiWord?.payload.word
            .split("")
            .map((l) =>
                apiMatch?.payload.userEnteredInputs
                    .toLocaleLowerCase()
                    .includes(l.toLocaleLowerCase())
                    ? l
                    : "_"
            );

    const keyboardButtons = () => {
        return "abcdefghijklmnopqrstuvwxyz".split("").map((letter, idx) => (
            <KeyboardButton
                variant="contained"
                key={idx}
                disabled={
                    apiMatch?.payload.userEnteredInputs
                        .toLocaleLowerCase()
                        .includes(letter) || apiMatch?.payload.status !== "PLAYING"
                }
                onClick={() => {
                    if (isFetching === 0 && isMutating === 0) handleGuess(letter);
                }}
            >
                {letter}
            </KeyboardButton>
        ));
    };

    return (
        <>
            <Snackbar
                open={snackBar.open}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                message={snackBar.message}
                severity={snackBar.severity}
                onClose={toggleSnackbar}
            />
            <Container
                sx={{
                    paddingTop: 10,
                    paddingBottom: 10,
                }}
            >
                <AppBar elevation={0}>
                    <Toolbar>
                        <Typography variant="overline">Hangman</Typography>
                        <Box sx={{ flex: 1 }} />
                        <Typography variant="overline">{`CHANCES LEFT: ${
                            apiMatch?.payload.chancesLeft ?? 0
                        }`}</Typography>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md">
                    <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        spacing={4}
                        sx={{
                            mt: {
                                md: 5,
                                sm: 2,
                                xs: 2,
                            },
                            mb: {
                                md: 5,
                                sm: 2,
                                xs: 2,
                            },
                        }}
                    >
                        <Image
                            height={350}
                            width={350}
                            layout="fixed"
                            src={`/${apiMatch?.payload.chancesLeft}.png`}
                            priority
                        />
                        <Typography
                            gutterBottom
                            color="secondary"
                            fontWeight={"bold"}
                            sx={{
                                letterSpacing: "2rem",
                                margin: "0.4em -1em 0.2em 0",
                                fontSize: "2.5rem",
                            }}
                        >
                            {apiMatch?.payload.status === "PLAYING"
                                ? guessWord()
                                : apiWord?.payload.word}
                        </Typography>

                        {apiMatch?.payload.status !== "PLAYING" && (
                            <Typography
                                variant="h4"
                                fontWeight={"bold"}
                                color={
                                    apiMatch?.payload.status === "WON"
                                        ? green[500]
                                        : red[500]
                                }
                            >
                                {apiMatch?.payload.status}
                            </Typography>
                        )}

                        <Typography
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            {keyboardButtons()}
                        </Typography>
                    </Stack>
                </Container>
            </Container>
        </>
    );
};

export default Match;
