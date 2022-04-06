import { NextPage } from "next";
import React from "react";
import { Matches, useMatches } from "../../hangman/api";
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

const Scoreboard: NextPage<{}> = () => {
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMatches();

    return (
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
                                <Typography gutterBottom variant="h4" fontWeight={"bold"}>
                                    Your scoreboard
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <List disablePadding>
                                    {data?.pages.flatMap((page) =>
                                        page.response.payload.elements.map((match, i) =>
                                            renderRow(match, i)
                                        )
                                    )}
                                </List>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
};

const renderRow = ({ status, score, createdAt }: Matches.Match, index: number) => {
    return (
        <div key={index}>
            <ListItem button alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar sx={{ bgcolor: status == "WON" ? green[500] : (status == "PLAYING" ? grey[500]: red[500]) }}>
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

export default Scoreboard;
