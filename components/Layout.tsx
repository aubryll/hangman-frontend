import React from "react"
import { Container, CssBaseline } from "@mui/material";
import useAuthGuard from "./auth/AuthGuard";

export interface LayoutProps {
    children?: React.ReactNode;
}

export const Layout = useAuthGuard(({ children }: LayoutProps) => {
    return (
        <>
            <CssBaseline />
            <Container maxWidth="md">{children}</Container>
        </>
    );
});
