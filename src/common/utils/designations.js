export const newDesignations = [
    {
        "code": "BK70-65H2",
        "oldDesignation": "Vis de Cicatrisation BK Ø6.5 H2",
        "newDes": "Coiffe de cicatrisation sur implant maxillaire hauteur 2"
    },
    {
        "code": "BK70-4H2",
        "oldDesignation": "Vis de Cicatrisation BK Ø4 H2",
        "newDes": "Coiffe de cicatrisation sur implant universelle hauteur 2"
    },
    {
        "code": "BK70-4H4",
        "oldDesignation": "Vis de Cicatrisation BK Ø4 H4",
        "newDes": "Coiffe de cicatrisation sur implant universelle hauteur 4"
    },
    {
        "code": "BK70-5H2",
        "oldDesignation": "Vis de Cicatrisation BK Ø5 H2",
        "newDes": "Coiffe de cicatrisation sur implant mandibulaire hauteur 2"
    },
    {
        "code": "BK70-5H4",
        "oldDesignation": "Vis de Cicatrisation BK Ø5 H4",
        "newDes": "Coiffe de cicatrisation sur implant mandibulaire hauteur 4"
    },
    {
        "code": "BK70-65H4",
        "oldDesignation": "Vis de Cicatrisation BK Ø6.5 H4",
        "newDes": "Coiffe de cicatrisation sur implant maxillaire hauteur 4"
    },
    {
        "code": "NB70-RP-5H2",
        "oldDesignation": "Vis de Cicatrisation NB RP 5H2",
        "newDes": "Coiffe de cicatrisation sur implant Nobel connectique RP mandibulaire hauteur 1"
    },
    {
        "code": "NB70-RP-5H5",
        "oldDesignation": "Vis de Cicatrisation NB RP 5H5",
        "newDes": "Coiffe de cicatrisation sur implant Nobel connectique RP maxillaire hauteur 1"
    },
    {
        "code": "NB70-RP-5H3",
        "oldDesignation": "Vis de Cicatrisation NB RP 5H3",
        "newDes": "Coiffe de cicatrisation sur implant Nobel connectique RP mandibulaire hauteur 3"
    },
    {
        "code": "NB70-RP-5H6",
        "oldDesignation": "Vis de Cicatrisation NB RP 5H6",
        "newDes": "Coiffe de cicatrisation sur implant Nobel connectique RP maxillaire hauteur 3"
    },
    {
        "code": "SB70-RC-6H2",
        "oldDesignation": "Vis de Cicatrisation SB RC 6H2",
        "newDes": "Coiffe de cicatrisation sur implant Straumann connectique RC mandibulaire hauteur 1"
    },
    {
        "code": "SB70-RC-6H3",
        "oldDesignation": "Vis de Cicatrisation SB RC 6H3",
        "newDes": "Coiffe de cicatrisation sur implant Straumann connectique RC maxillaire hauteur 1"
    },
    {
        "code": "SB70-RC-6H4",
        "oldDesignation": "Vis de Cicatrisation SB RC 6H4",
        "newDes": "Coiffe de cicatrisation sur implant Straumann connectique RC mandibulaire hauteur 3"
    },
    {
        "code": "SB70-RC-6H5",
        "oldDesignation": "Vis de Cicatrisation SB RC 6H5",
        "newDes": "Coiffe de cicatrisation sur implant Straumann connectique RC maxillaire hauteur 3"
    },
    {
        "code": "ST70-RPH2",
        "oldDesignation": "Vis de Cicatrisation ST RP H2",
        "newDes": "Coiffe de cicatrisation sur implant Straumann RP connectique RN mandibulaire hauteur 2"
    },
    {
        "code": "ST70-RPH3",
        "oldDesignation": "Vis de Cicatrisation ST RP H3",
        "newDes": "Coiffe de cicatrisation sur implant Straumann RP connectique RN maxillaire hauteur 2"
    },
    {
        "code": "ST70-WPH2",
        "oldDesignation": "Vis de Cicatrisation WP H2",
        "newDes": "Coiffe de cicatrisation sur implant Straumann WN connectique WN mandibulaire hauteur 1"
    },
    {
        "code": "ST70-WPH3",
        "oldDesignation": "Vis de Cicatrisation WP H3",
        "newDes": "Coiffe de cicatrisation sur implant Straumann WN connectique WN maxillaire hauteur 1"
    }
]

export const returnNewDesignation = (product) => {
    const isNewDes = newDesignations.find((des) => des.code === product.reference);

    if (isNewDes) {
        return {
            ...product,
            designation: isNewDes.newDes
        }
    } else {
        return product
    }
}