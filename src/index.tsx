import React from "react";
import ReactDOM from "react-dom/client";

/* State management */
import { RecoilRoot } from "recoil";

/* Data fetching */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* Theme-color */
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";

/* Global-style */
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

/* App component */
import App from "./App";

const GlobalStyle = createGlobalStyle`
${reset};
* {
  box-sizing: border-box;
}
body {
  overflow-x: hidden;
  background-color: black;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 700; // (300light, 400regular, 500medium, 700bold)
  color: ${(props) => props.theme.white.darker};
  line-height: 1.4;
}
a {
  text-decoration: none;
  color: inherit;
}
`;

const client = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>
);
