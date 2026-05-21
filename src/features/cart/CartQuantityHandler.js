import React, {useState} from "react";
import {decreaseQuantity, increaseQuantity, updateQuantity,} from "./cartSlice";
import {useDispatch} from "react-redux";
import toast from "react-hot-toast";
import styles from "./cartQuantityHandler.module.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CartQuantityHandler = ({product}) => {
    const [quantity, setQuantity] = useState(product.cartQuantity);

    const dispatch = useDispatch();

    const handleDecreaseQuantity = (product) => {
        if (quantity > 1) {
            const newQuantity = parseInt(quantity) - 1;
            setQuantity(newQuantity);
        }
        dispatch(decreaseQuantity(product));
    };
    const handleIncreaseQuantity = (product) => {
        const newQuantity = parseInt(quantity) + 1;
        setQuantity(newQuantity);
        dispatch(increaseQuantity(product));
    };

    const handleInputChange = (quantity) => {
        setQuantity(quantity);
    };

    const handleQuantityChange = (product, quantity) => {
        if (isNaN(quantity) || !quantity.length) {
            return toast.error("Merci d'entrer une quantité valide.");
        }
        const updatedProduct = {
            ...product,
            cartQuantity: parseInt(quantity),
        };
        dispatch(updateQuantity(updatedProduct));
    };

    return (
        <div className={styles.quantityInput}>
            <button onClick={() => handleDecreaseQuantity(product)}>
                {" "}
                <RemoveIcon fontSize="medium"/>
            </button>
            <input
                value={quantity}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyUp={(e) => handleQuantityChange(product, e.target.value)}
            ></input>{" "}
            <button onClick={() => handleIncreaseQuantity(product)}>
                {" "}
                <AddIcon fontSize="medium"/>
            </button>
        </div>
    );
};
export default CartQuantityHandler;
