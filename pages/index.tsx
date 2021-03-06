import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
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
    Card,
    CardContent,
    AlertColor,
    Container,
    Divider,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useIsFetching, useIsMutating } from "react-query";
import CustomLink from "../components/CustomLink";
import { useAuthState } from "../components/globalStores/useAuthStore";
import Snackbar from "../components/Snackbar";
import { Auth, useSignIn } from "../hangman/api";
import { setUserTokenResponse } from "../hangman/token/userTokenResponse";

const Signin: NextPage<{}> = observer(() => {
    const router = useRouter();
    const {
        authState: { token },
        setUserAuth,
    } = useAuthState();
    const returnUrl = (router.query.returnUrl || "/matches") as string;
    const { message } = router.query;
    const { trigger, watch, getValues, control } = useForm<Auth>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPasswordChange = () => setShowPassword((prev) => !prev);
    const [snackBar, setSnackBar] = useState<{
        open: boolean;
        message?: string;
        severity?: AlertColor;
    }>({ open: false });

    const isFetching = useIsFetching();
    const isMutating = useIsMutating();

    const { mutate, data } = useSignIn({
        onError(error?: any): void {
            setSnackBar({
                ...snackBar,
                open: true,
                severity: "error",
                message: error?.payload.message ?? "Unknown error occurred, try again",
            });
        },
    });

    const handleUserAuthenticated = () => {
        if (token) {
            router.push(returnUrl);
        }
        if (data) {
            setUserTokenResponse(data.payload);
            setUserAuth({
                token: data.payload,
            });
            router.push(returnUrl);
        }
    };

    const handleSubmit = async () => {
        const isValid = await trigger();
        if (isValid) {
            const data = getValues();
            mutate(data);
        }
    };
    const toggleSnackbar = () =>
        setSnackBar({
            ...snackBar,
            open: !snackBar.open,
        });

    const handleSignInMessage = () => {
        if (message) {
            setSnackBar({
                ...snackBar,
                severity: "success",
                message: message as string,
                open: true,
            });
            //remove message
            router.replace("/", undefined, { shallow: true });
        }
    };
    //TODO: might be worth looking into how to how to handle this in the AuthGuard
    React.useEffect(handleUserAuthenticated, [token, data]);
    React.useEffect(handleSignInMessage, [message]);

    return (
        <form>
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
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12}>
                                        <Typography
                                            gutterBottom
                                            variant="h4"
                                            fontWeight={"bold"}
                                        >
                                            Sign in to your account
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Controller
                                            name="email"
                                            control={control}
                                            rules={{
                                                required: "Enter your email address",
                                            }}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <TextField
                                                    label="Email address"
                                                    placeholder="Enter your email address"
                                                    fullWidth
                                                    variant="standard"
                                                    type="email"
                                                    value={value}
                                                    error={!!error}
                                                    helperText={
                                                        error ? error.message : null
                                                    }
                                                    onChange={onChange}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Controller
                                            name="password"
                                            control={control}
                                            rules={{
                                                required: "Enter your email address",
                                            }}
                                            render={({
                                                field: { onChange, value },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl fullWidth variant="standard">
                                                    <InputLabel>Password</InputLabel>
                                                    <Input
                                                        placeholder={
                                                            "Enter your password"
                                                        }
                                                        value={value}
                                                        error={!!error}
                                                        onChange={onChange}
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={
                                                                        handleShowPasswordChange
                                                                    }
                                                                    onMouseDown={
                                                                        handleShowPasswordChange
                                                                    }
                                                                    edge="end"
                                                                >
                                                                    {showPassword ? (
                                                                        <VisibilityOff />
                                                                    ) : (
                                                                        <Visibility />
                                                                    )}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                    <FormHelperText>
                                                        {error ? error.message : null}
                                                    </FormHelperText>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Stack
                                            direction={{
                                                sm: "column-reverse",
                                                xs: "column-reverse",
                                                md: "row-reverse",
                                            }}
                                            spacing={4}
                                            marginY={2}
                                            justifyContent={{
                                                md: "start",
                                                sm: "center",
                                                xs: "center",
                                            }}
                                            alignItems={{
                                                md: "start",
                                                sm: "center",
                                                xs: "center",
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{ alignSelf: "center" }}
                                            >
                                                Don't have an account?{" "}
                                                <CustomLink
                                                    href={`/signup`}
                                                    name={"Sign up"}
                                                />
                                            </Typography>
                                            <LoadingButton
                                                variant="contained"
                                                onClick={handleSubmit}
                                                loading={isFetching > 0 || isMutating > 0}
                                                sx={{
                                                    width: {
                                                        sm: "100%",
                                                        xs: "100%",
                                                        md: "fit-content",
                                                    },
                                                }}
                                            >
                                                Sign in
                                            </LoadingButton>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                </Container>
            </>
        </form>
    );
});

export default Signin;
