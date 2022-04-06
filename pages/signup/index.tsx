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
import CustomLink from "../../components/CustomLink";
import { User } from "../../hangman/api";

const Signup: NextPage<{}> = () => {
    const { trigger, watch, getValues, control } = useForm<User>({
        defaultValues: {
            fName: "",
            lName: "",
            email: "",
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
                                <Typography gutterBottom variant="h4" fontWeight={"bold"}>
                                    Create an account
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="fName"
                                    control={control}
                                    rules={{
                                        required: "Enter your first name",
                                    }}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            label="First name"
                                            placeholder="Enter your first name"
                                            fullWidth
                                            variant="standard"
                                            value={value}
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Controller
                                    name="lName"
                                    control={control}
                                    rules={{
                                        required: "Enter your last name",
                                    }}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            label="Last name"
                                            placeholder="Enter your last name"
                                            fullWidth
                                            variant="standard"
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
                                    <Typography variant="body2" sx={{alignSelf: "center"}}>
                                        Already have an account?{' '}
                                        <CustomLink href={`/signin`} name={"Sign In"} />
                                    </Typography>
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
                                       Create account
                                    </LoadingButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
};

export default Signup;
