import React from "react";
import {Box} from "@mui/material";
import DistributorSearch from "./DistributorSearch";

/**
 * Empty ordering row — luxury aesthetic.
 *
 * Differentiation from filled rows is achieved purely with whitespace and a
 * very faint hairline (no tinted backgrounds, no dashed borders). The search
 * itself carries enough affordance through its leading icon + placeholder.
 */
const DistributorCartRowEmpty = () => (
    <Box
        sx={{
            mb: 1,
            border: "1px solid",
            borderColor: "rgba(0,0,0,0.08)",
            backgroundColor: "#fff",
            transition: "border-color 0.2s",
            "&:hover": {borderColor: "rgba(0,0,0,0.18)"},
            "&:focus-within": {borderColor: "#1BA9AA", boxShadow: "0 0 0 1px #1BA9AA inset"},
        }}
    >
        <DistributorSearch/>
    </Box>
);

export default DistributorCartRowEmpty;
