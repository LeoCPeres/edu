import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { MyRoutes } from "./routes/MyRoutes";
import { AuthContextProvider } from "./contexts/AuthContext";
import { defaultTheme } from "./styles/theme";

function App() {
  return (
    <ChakraProvider theme={defaultTheme}>
      <AuthContextProvider>
        <MyRoutes />
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
