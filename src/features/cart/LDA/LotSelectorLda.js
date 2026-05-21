import React from "react";

const LotSelectorLda = ({handleSelectLot, product, lot}) => {
    return (
        <>
            <select onChange={(e) => handleSelectLot(product, e)}>
                <option value="">
                    Sélectionner un lot
                </option>
                {lot.map((b, index) => (
                    <option key={index} value={b.name}>
                        {b.name}
                    </option>
                ))}
            </select>
        </>
    )
}

export default LotSelectorLda