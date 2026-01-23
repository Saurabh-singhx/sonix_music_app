import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiInputBase-input": {
                        color: "white",
                    },
                    "& .MuiInputLabel-root": {
                        color: "white",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: "white",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                },
            },
        },
    },
});



