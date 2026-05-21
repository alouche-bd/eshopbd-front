import React from "react";
import {Grid} from "@mui/material";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const CreditsSold = ({creditSold}) => {
    const Item = styled(Paper)(({theme}) => ({
        ...theme.typography.body2,
        padding: "25px",
        textAlign: "center",
        color: theme.palette.text.secondary,
    }));

    return (
        <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="center"
            alignItems="stretch"
        >
            {creditSold?.map((credit, index) => (
                <Grid item md={6} key={index}>
                    <Item>
                        <h4>Mon solde {credit.libelle}</h4>
                        <h4>{credit.solderestant}</h4>
                    </Item>
                </Grid>
            ))}
        </Grid>
    );
};

export default CreditsSold;
