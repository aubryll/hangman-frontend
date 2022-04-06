import React from "react"
import { Container, CssBaseline } from "@mui/material";

export interface LayoutProps {
    children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <CssBaseline />
            <Container maxWidth="md">{children}</Container>
        </>
    );
};
