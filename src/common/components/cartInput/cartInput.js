import React, { useEffect, useState } from "react";
import { updateProduct } from "../../../features/cart/cartSlice";
import { useDispatch } from "react-redux";

/* ------------------------------------------------------------------------- */
const CartInput = ({ product, inputType, type, isConst }) => {

    const dispatch = useDispatch();
    const [input, setInput] = useState( product[inputType] ? product[inputType] : "" );
    // eslint-disable-next-line no-unused-vars
    const [fixed, setFixed] = useState( isConst ? isConst : false );

    const handleStateChange = (product, input) => {
        const typeCorrectedInput = type === "number"
            ? input ? parseFloat(input) : ""
            : input ? input : "";

        const updatedProduct = { ...product, [inputType]: typeCorrectedInput, };
        setInput(input);
        dispatch(updateProduct({ product: updatedProduct, type: inputType }));
    };

    useEffect(() => {
        setInput( product[inputType] ? product[inputType] : type === "number" ? "0" : "");

    }, [inputType, type, product]);

    return (
        <input value={input} onChange={(e) => handleStateChange(product, e.target.value)} disabled={ fixed }/>
    );
};

export default CartInput;