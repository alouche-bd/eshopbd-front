import React from "react";
import {List, ListItem} from "@mui/material";

const AddressRow = (props) => {
    return (
        <List>
            <ListItem>
                {props.item.libelle ? props.item.libelle : props.item.intitule}
            </ListItem>
            <ListItem>
                {props.item.adresse ? props.item.adresse : props.item.adresse1}
            </ListItem>
            {props.item.adresse2 !== " " && (
                <ListItem>{props.item.adresse2}</ListItem>
            )}
            {props.item.adresse3 !== " " && (
                <ListItem>{props.item.adresse3}</ListItem>
            )}
            <ListItem>
                {props.item.codepostal}, {props.item.ville}
            </ListItem>
            {props.item.telephone !== " " && (
                <ListItem>{props.item.telephone}</ListItem>
            )}
            {props.item.mobile !== " " && <ListItem>{props.item.mobile}</ListItem>}
            {props.item.fax !== " " && <ListItem>{props.item.fax}</ListItem>}
            {props.item.email !== " " && <ListItem>{props.item.email}</ListItem>}
        </List>
    );

};

export default AddressRow;
