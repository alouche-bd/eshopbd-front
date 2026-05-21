import MUIDataTable from "mui-datatables";
import React from "react";
import {createTheme, ThemeProvider} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TableHeader from "./TableHeader";
import {makeStyles} from "@mui/styles";

const Table = (props) => {
    const getMuiTheme = () =>
        createTheme({
            overrides: {
                MUIDataTableHeadCell: {
                    contentWrapper: {
                        justifyContent: "center",
                    },
                    data: {
                        color: "#1a8f9b",
                        fontFamily: "ITC Avant Garde Std text",
                        fontWeight: "bold",
                        fontSize: "medium",
                    },
                    fixedHeader: {
                        backgroundColor: "#f0f3f8",
                    },
                },
                MUIDataTablePagination: {
                    navContainer: {
                        display: "flex",
                        justifyContent: "center",
                    },
                },
                MUIDataTableBodyCell: {
                    root: {
                        textAlign: "center",
                        color: "#575756",
                        fontFamily: "ITC Avant Garde Std text",
                        fontSize: "initial",
                    },
                    stackedHeader: {
                        color: "#1a8f9b",
                        fontFamily: "ITC Avant Garde Std text",
                        fontWeight: "bold",
                        fontSize: "medium",
                    },
                },
                MuiTableRow: {
                    root: {
                        "&$hover:hover": {backgroundColor: "#f7f9fc"},
                    },
                },
                MuiTableCell: {
                    root: {
                        borderBottom: "#f0f3f8 solid 2px",
                    },
                },
            },
        });

    const useStyles = makeStyles((theme) => ({
        globalGrid: {
            width: "100%",
            display: "block",
            justify: "center",
        },
        tableHeaderTitle: {
            color: "white",
            fontWeight: "bold",
            fontFamily: "ITC Avant Garde Std title",
        },
        tableHeaderSubtitle: {
            color: "white",
        },
        iconRoundedWhiteBack: {
            color: "white",
        },
        iconColorGreen: {
            color: "#1ba9aa",
        },
        tableHeader: {
            background: "radial-gradient(#1ba9aa, #1a8f9b)",
            padding: "12px",
            borderRadius: "1.5rem 1.5rem 0rem 0rem",
            border: "solid 1px #e3e8ef",
        },
        table: {
            borderRadius: "0rem 0rem 1.5rem 1.5rem",
            boxShadow: "none",
            border: "solid 1px #e3e8ef",
        },
    }));

    const options = {
        ...props.options,
        rowsPerPage: 10,
        textLabels: {
            body: {
                noMatch: "Aucun résultat",
                toolTip: "Trier",
                columnHeaderTooltip: (column) => `Trier par ${column.label}`,
            },
            pagination: {
                next: "Page suivante",
                previous: "Page précédente",
                rowsPerPage: "",
                displayRows: "sur",
            },
            toolbar: {
                search: "Rechercher",
                downloadCsv: "Télécharger CSV",
                print: "Imprimer",
                viewColumns: "Voir les colonnes",
                filterTable: "Filtrer",
            },
            filter: {
                all: "Tous",
                title: "FILTRES",
                reset: "RESET",
            },
            viewColumns: {
                title: "Afficher les colonnes",
                titleAria: "Afficher/cacher les colonnes",
            },
            selectedRows: {
                text: "Lignes sélectionnées",
                delete: "Suprimer",
                deleteAria: "Supprimer les lignes selectionnées",
            },
        },
    };
    const classes = useStyles();

    return (
        <Grid container className={classes.globalGrid}>
            <TableHeader
                icon={props.icon}
                title={props.title}
                subtitle={props.subtitle}
            />
            <ThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                    data={props.data}
                    columns={props.columns}
                    options={options}
                    className={classes.table}
                />
            </ThemeProvider>
        </Grid>
    );
};

export default Table;
