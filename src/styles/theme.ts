import { extendTheme } from "@chakra-ui/react";

// 2. Call `extendTheme` and pass your custom values
export const defaultTheme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "Poppins",
      },
    },
  },
});
