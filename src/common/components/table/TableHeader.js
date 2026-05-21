import React from "react";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const TableHeader = (props) => {
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
    const classes = useStyles();

    return (
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            className={classes.tableHeader}
        >
            <Grid item>
        <span className="fa-stack xl fa-2x">
          <i
              className={`fas fa-circle fa-stack-2x ${classes.iconRoundedWhiteBack}`}
          />
          <i
              className={`fa-stack-1x ${props.icon} ${classes.iconColorGreen}`}
          />
        </span>
            </Grid>
            <Grid item xs container>
                <Grid item xs container direction="column" spacing={2}>
                    <Grid item xs>
                        <Typography
                            gutterBottom
                            variant="subtitle1"
                            className={classes.tableHeaderTitle}
                        >
                            {props.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            className={classes.tableHeaderSubtitle}
                        >
                            {props.subtitle}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
export default TableHeader;
