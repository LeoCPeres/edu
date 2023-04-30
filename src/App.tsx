import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { MyRoutes } from "./routes/MyRoutes";
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <MyRoutes />
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
