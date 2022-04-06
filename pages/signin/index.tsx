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
} from "@mui/material";
import { NextPage } from "next";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Auth } from "../../hangman/api";

const Signin: NextPage<{}> = () => {
    const { trigger, watch, getValues, control } = useForm<Auth>({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPasswordChange = () => setShowPassword((prev) => !prev);

    return (
        <Container maxWidth="sm">
            <Stack
                direction="column"
                sx={{
                    mt: {
                        md: 20,
                        sm: 2,
                        xs: 2,
                    },
                    mb: {
                        md: 20,
                        sm: 2,
                        xs: 2,
                    },
                }}
            >
                <Card variant="outlined">
                    <CardContent sx={{ padding: 4 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Typography gutterBottom variant="h4" fontWeight={"bold"}>
                                    Sign in to your account
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Controller
                                    name="username"
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
                                            helperText={error ? error.message : null}
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
                                                placeholder={"Enter your password"}
                                                value={value}
                                                error={!!error}
                                                onChange={onChange}
                                                type={showPassword ? "text" : "password"}
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
                                <LoadingButton
                                    variant="contained"
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
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
};

export default Signin;
