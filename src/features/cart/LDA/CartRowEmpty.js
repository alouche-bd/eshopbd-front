import React from 'react';
import {Box} from '@mui/material';
import SearchProducts from './SearchProducts';

/**
 * Empty ordering row for the LDA workflow — luxury aesthetic matching
 * /distributor's DistributorCartRowEmpty. Hairline border + teal focus
 * accent. The inline SearchProducts component handles the input + dropdown.
 */
const CartRowEmpty = () => (
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
        <SearchProducts/>
    </Box>
);

export default CartRowEmpty;
