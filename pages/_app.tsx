import * as React from "react";
import { AppProps } from "next/app";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Layout } from "../components/Layout";

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <React.Fragment>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </React.Fragment>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
