import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import theme from "../components/ui/theme";
import { ThemeProvider } from "@chakra-ui/react";



function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
</ChakraProvider>
  )
}

export default MyApp