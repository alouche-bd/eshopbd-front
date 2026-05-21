import ITC from "../../assets/fonts/ITCAvantGardeStd-Bk.ttf";
import ITCTitle from "../../assets/fonts/ITCAvantGardeStd-Bk_BIOTECHBIOTECH.ttf";
import {createTheme} from "@mui/material/styles";
import {frFR as coreFr} from "@mui/material/locale";
import {frFR} from "@mui/x-data-grid";

const itcAvantGardeText = {
    fontFamily: "ITC Avant Garde Std text",
    fontStyle: "normal",
    fontWeight: 400,
    src: `
    local('ITC Avant Garde Std text'),
    local('ITC Avant Garde Std text-Regular'),
    url(${ITC}) format('ttf')
  `,
};

const itcAvantGardeTitle = {
    fontFamily: "ITC Avant Garde Std title",
    fontStyle: "normal",
    fontWeight: 400,
    src: `
    local('ITC Avant Garde Std title'),
    local('ITC Avant Garde Std text-title'),
    url(${ITCTitle}) format('ttf')
  `,
};

export const theme = createTheme(
    {
        typography: {
            fontFamily: "ITC Avant Garde Std text, ITC Avant Garde Std title",
            fontSize: 14,
        },
        palette: {
            primary: {
                main: "#575756",
                contrastText: "#fff",
            },
            secondary: {
                main: "#1ba9aa",
                contrastText: "#fff",
            },
        },

        overrides: {
            MuiCssBaseline: {
                "@global": {
                    "@font-face": [itcAvantGardeText, itcAvantGardeTitle],
                    color: "#575756",
                },
            },
        },
    },
    frFR,
    coreFr
);
