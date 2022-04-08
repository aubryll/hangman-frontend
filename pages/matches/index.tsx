import { NextPage } from "next";
import React, { useState } from "react";
import { PaginatedMatches, useCreateMatch, useMatches } from "../../hangman/api";
import {
    Grid,
    TextField,
    IconButton,
    InputAdornment,
    InputLabel,
    FormControl,
    Input,
    Typography,
    FormHelperText,
    Stack,
    Alert,
    Button,
    Box,
    StepLabel,
    OutlinedInput,
    Card,
    CardContent,
    AlertColor,
    useTheme,
    useMediaQuery,
    Container,
    Divider,
    List,
    ListItem,
} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { EmojiEvents, PlayArrow, SentimentDissatisfied } from "@mui/icons-material";
import { formatDistance } from "date-fns";
import { green, grey, red } from "@mui/material/colors";
import { LoadingButton } from "@mui/lab";
import { useRouter } from "next/router";
import { accessToken, userId } from "..";
import Snackbar from "../../components/Snackbar";
import { useIsFetching, useIsMutating } from "react-query";
const Scoreboard: NextPage<{}> = () => {
    const isFetching = useIsFetching();
    const isMutating = useIsMutating();
    const { data, isLoading, fetchNextPage, hasNextPage } = useMatches();
    const [snackBar, setSnackBar] = useState<{
        open: boolean;
        message?: string;
        severity?: AlertColor;
    }>({ open: false });

    const toggleSnackbar = () =>
        setSnackBar({
            ...snackBar,
            open: !snackBar.open,
        });

    const { mutate, data: newMatchData } = useCreateMatch({
        onError(error?: any): void {
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "error",
                message: "Error occurred, try again",
            });
        },
    });

    const router = useRouter();

    const handleMatchClciked = (id: number) => {
        router.push(`/matches/${id}`);
    };

    React.useEffect(() => {
        if (userId == 0 || accessToken.length == 0) {
            router.push("/");
        }
    }, []);

    React.useEffect(() => {
        if (newMatchData) handleMatchClciked(newMatchData.payload.id);
    }, [newMatchData]);

    const renderRow = (
        { id, status, score, createdAt }: PaginatedMatches.Match,
        index: number
    ) => {
        return (
            <div key={index}>
                <ListItem
                    button
                    alignItems="flex-start"
                    onClick={() => {
                        handleMatchClciked(id);
                    }}
                >
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                bgcolor:
                                    status == "WON"
                                        ? green[500]
                                        : status == "PLAYING"
                                        ? grey[500]
                                        : red[500],
                            }}
                        >
                            {status == "WON" ? (
                                <EmojiEvents />
                            ) : status == "PLAYING" ? (
                                <PlayArrow />
                            ) : (
                                <SentimentDissatisfied />
                            )}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Typography variant="subtitle2">{status}</Typography>}
                        secondary={
                            <>
                                <Typography
                                    variant="body2"
                                    component="span"
                                    color="secondary"
                                >
                                    {`Points scored: ${score}`}
                                </Typography>
                                <br />
                                {formatDistance(new Date(createdAt), new Date(), {
                                    addSuffix: true,
                                })}
                            </>
                        }
                    />
                </ListItem>
                <Divider variant="inset" component="li" />
            </div>
        );
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
            <Container maxWidth="sm">
                <Stack
                    direction="column"
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
                    <Card variant="outlined">
                        <CardContent sx={{ padding: 4 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography
                                        gutterBottom
                                        variant="h4"
                                        fontWeight={"bold"}
                                    >
                                        Your scoreboard
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton
                                        variant="contained"
                                        fullWidth
                                        disabled={isFetching > 0 || isMutating > 0}
                                        onClick={() =>
                                            mutate({
                                                userId,
                                            })
                                        }
                                    >
                                        New game
                                    </LoadingButton>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12}>
                                    <List disablePadding>
                                        {data?.pages.flatMap((page) =>
                                            page.response.payload.elements.map(
                                                (match, i) => renderRow(match, i)
                                            )
                                        )}
                                    </List>
                                </Grid>
                                <Grid item xs={12}>
                                    <LoadingButton
                                        disabled={!hasNextPage}
                                        loading={isLoading}
                                        onClick={() => fetchNextPage()}
                                    >
                                        Load more
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Stack>
            </Container>
        </>
    );
};

export default Scoreboard;
