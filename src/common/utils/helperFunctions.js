import toast from "react-hot-toast";
import WarningIcon from "@mui/icons-material/Warning";
import {orange} from "@mui/material/colors";

export const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

export const getComparator = (order, orderBy) => {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

export const isoStringToDate = (isoString) => {
    let date = new Date(isoString);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
        dt = "0" + dt;
    }
    if (month < 10) {
        month = "0" + month;
    }

    return dt + "-" + month + "-" + year;
};

export const importAllImages = (required) => {
    let images = {};
    required.keys().forEach((item, index) => {
        images[item.replace("./", "")] = required(item);
    });
    return images;
};

export const findImgGenerique = (product, images) => {
    const {marketing} = product;
    if (product.catalogueniv1 === "IMPLANT" && !product.marketing) {
        return images["IMPLANTS.png"]?.default;
    }
    if (marketing) {
        const catalogue = Object.values(marketing.catalogue1)
            .join("_")
            .replaceAll(" / ", "-")
            .replaceAll("/", "-")
            .toUpperCase();
        const catalogueLenght = Object.keys(marketing.catalogue1).length;
        if (images[catalogue + ".jpg"]?.default) {
            return images[catalogue + ".jpg"]?.default;
        } else if (images[catalogue + ".png"]?.default) {
            return images[catalogue + ".png"]?.default;
        }
        for (let index = 1; index <= catalogueLenght; index++) {
            let splitCatalogue = catalogue.split("_", catalogueLenght - index);
            if (images[splitCatalogue.join("_") + ".jpg"]?.default) {
                return images[splitCatalogue.join("_") + ".jpg"]?.default;
            } else if (images[splitCatalogue.join("_") + ".png"]?.default) {
                return images[splitCatalogue.join("_") + ".png"]?.default;
            }
        }
    }
};

export const formatPrice = (number) => {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(number / 100);
};

export const getUniqueValues = (data, type) => {
    let unique = data.map((item) => item[type]);
    return ["TOUTES", ...new Set(unique)];
};

export const escapeRegExp = (value) => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const convertDate = (dateString) => {
    let p = dateString.split(/\D/g);
    return [p[2], p[1], p[0]].join("-");
};

export const capitalizeTheFirstLetterOfEachWord = (words) => {
    let separateWord = words.toLowerCase().split(" ");
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] =
            separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
    }
    return separateWord.join(" ");
};

export const convertBase64ToPdfDl = (base64, filename) => {
    let byteCharacters = atob(base64);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], {type: "application/octet-stream;base64"});
    const link = document.createElement("a");
    var fileURL = URL.createObjectURL(file);
    link.href = fileURL;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 7000);
};

export const convertBase64ToPdfSee = (base64) => {
    let byteCharacters = atob(base64);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], {type: "application/pdf;base64"});
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL);
};

export const todayDate = () => {
    const today = new Date();
    return `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
};

export const stockAlertIncrease = (itemAdded, itemExist, alertArray) => {
    if (itemExist) {
        if (itemAdded.stockdisponible < itemExist.cartQuantity + 1) {
            if (!alertArray.find((item) => item.reference === itemAdded.reference)) {
                toast(
                    (t) => (
                        <div>
                            <p>
                                Nos stocks pour l'article {itemAdded.reference} sont
                                insuffisants pour satisfaire votre commande.{" "}
                            </p>
                            <p>
                                Vous pouvez néanmoins conserver l'article dans votre panier, un
                                reste à livrer sera généré automatiquement et les articles vous
                                seront envoyés dès leur réassort.
                            </p>
                            <div>
                                <button
                                    style={{
                                        padding: "15px",
                                        background: "transparent",
                                        fontSize: "inherit",
                                        fontFamily: "inherit",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => toast.dismiss(t.id)}
                                >
                                    J'ai compris
                                </button>
                            </div>
                        </div>
                    ),
                    {
                        duration: Infinity,
                        icon: <WarningIcon sx={{color: orange[500]}} fontSize="large"/>,
                        style: {
                            maxWidth: "450px",
                        },
                    }
                );
                alertArray.push({
                    reference: itemAdded.reference,
                });
            }
        }
    }
};

const noAlert = [
    {
        "reference": "1510",
        "designation": "cerabone® Granules 0,5 cc - matériel de substitution osseuse d'origine bovine",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE BOVINE",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "CERABONE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 75,
        "notification": ""
    },
    {
        "reference": "1511",
        "designation": "cerabone® Granules 1,0 cc - matériel de substitution osseuse d'origine bovine",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE BOVINE",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "CERABONE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 103,
        "notification": ""
    },
    {
        "reference": "1512",
        "designation": "cerabone® Granules 2,0 cc - matériel de substitution osseuse d'origine bovine",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE BOVINE",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "CERABONE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 149,
        "notification": ""
    },
    {
        "reference": "1515",
        "designation": "cerabone® Granules 5,0 cc - matériel de substitution osseuse d'origine bovine",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE BOVINE",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "CERABONE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 262,
        "notification": ""
    },
    {
        "reference": "1521",
        "designation": "cerabone® Granules 1,0 cc - matériel de substitution osseuse d'origine bovine",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE BOVINE",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "CERABONE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 105,
        "notification": ""
    },
    {
        "reference": "1522",
        "designation": "cerabone® Granules 2,0 cc - matériel de substitution osseuse d'origine bovine",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE BOVINE",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "CERABONE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 149,
        "notification": ""
    },
    {
        "reference": "1525",
        "designation": " cerabone® Granules 5,0 cc - matériel de substitution osseuse d'origine bovine",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE BOVINE",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "CERABONE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 262,
        "notification": ""
    },
    {
        "reference": "1810",
        "designation": "cerabone® plus 0,5 ml - minéral osseux d'origine bovine avec hyaluronate",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE BOVINE",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "CERABONE+",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 105,
        "notification": ""
    },
    {
        "reference": "1811",
        "designation": "cerabone® plus 1,0 ml - minéral osseux d'origine bovine avec hyaluronate",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE BOVINE",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "CERABONE+",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 149,
        "notification": ""
    },
    {
        "reference": "20005",
        "designation": "Substitut de greffon osseux résorbable, synthétique - maxresorb® Granules 0,5 cc",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE SYNTHETIC  ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "MAXRESORB",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 79,
        "notification": ""
    },
    {
        "reference": "20010",
        "designation": "Substitut de greffon osseux résorbable, synthétique - maxresorb® Granules 1,0 cc",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE SYNTHETIC  ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "MAXRESORB",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 97,
        "notification": ""
    },
    {
        "reference": "20105",
        "designation": "Substitut de greffon osseux résorbable, synthétique - maxresorb® Granules 0,5 cc",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE SYNTHETIC  ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "MAXRESORB",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 79,
        "notification": ""
    },
    {
        "reference": "20120",
        "designation": "Substitut de greffon osseux résorbable, synthétique - maxresorb® Granules 2,0 cc",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE SYNTHETIC  ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "MAXRESORB",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 149,
        "notification": ""
    },
    {
        "reference": "22005",
        "designation": "Substitut osseux résorbable injectable - maxresorb® inject 0,5 cc",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE SYNTHETIC  ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "MAXRESORB INJECT",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 119,
        "notification": ""
    },
    {
        "reference": "22010",
        "designation": "Substitut osseux résorbable injectable - maxresorb® inject 1,0 cc",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE SYNTHETIC  ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "MAXRESORB INJECT",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 136,
        "notification": ""
    },
    {
        "reference": "22025",
        "designation": "Substitut osseux résorbable injectable - maxresorb® inject 2,5 cc",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "BONE TISSUE SYNTHETIC  ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "MAXRESORB INJECT",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 176,
        "notification": ""
    },
    {
        "reference": "511112",
        "designation": "collacone® Alveo cone - Cône hémostatique de collagène",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "DISPOSITIFS HEMOSTATIQUES",
                "niv3": "CONES",
                "niv4": "COLLACONE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 92,
        "notification": ""
    },
    {
        "reference": "512212",
        "designation": "collafleece ® 2 x 2 cm - Hémostatique de collagène (éponge)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "DISPOSITIFS HEMOSTATIQUES",
                "niv3": "EPONGES",
                "niv4": "COLLAFLEECE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 229,
        "notification": ""
    },
    {
        "reference": "512212/1",
        "designation": "collafleece ® 2 x 2 cm - Hémostatique de collagène (éponge) unitaire",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "DISPOSITIFS HEMOSTATIQUES",
                "niv3": "EPONGES",
                "niv4": "COLLAFLEECE",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 60,
        "stockdisponible": 60,
        "puttc": 0,
        "notification": "Fin de vie"
    },
    {
        "reference": "601520",
        "designation": "collprotect® membrane 15 x 20 mm - Membrane de collagène natif ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "COLLPROTECT",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 112,
        "notification": ""
    },
    {
        "reference": "602030",
        "designation": "collprotect® membrane 20 x 30 mm - Membrane de collagène natif",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "COLLPROTECT",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 170,
        "notification": ""
    },
    {
        "reference": "603040",
        "designation": "collprotect® membrane 30 x 40 mm - Membrane de collagène natif",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "COLLPROTECT",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 229,
        "notification": ""
    },
    {
        "reference": "681520",
        "designation": "Jason® membrane 15 x 20 mm -  péricardique natif pour ROG/RTG",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "JASON",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 139,
        "notification": ""
    },
    {
        "reference": "682030",
        "designation": "Jason® membrane 20 x 30 mm - Membrane péricardique natif pour ROG/RTG",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "JASON",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 170,
        "notification": ""
    },
    {
        "reference": "683040",
        "designation": "Jason® membrane 30 x 40 mm - Membrane péricardique nati pour ROG/RTG",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "JASON",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 235,
        "notification": ""
    },
    {
        "reference": "701520",
        "designation": "mucoderm® 15 x 20 mm - greffe (collagène) de tissu mou",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "MATRICES DE RECONSTRUCTION TISSULAIRE",
                "niv4": "MUCODERM",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 179,
        "notification": ""
    },
    {
        "reference": "702030",
        "designation": "mucoderm® 20 x 30 mm - greffe (collagène) de tissu mou",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "MATRICES DE RECONSTRUCTION TISSULAIRE",
                "niv4": "MUCODERM",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 229,
        "notification": ""
    },
    {
        "reference": "703040",
        "designation": "mucoderm® 30 x 40 mm - greffe (collagène) de tissu mou",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "MATRICES DE RECONSTRUCTION TISSULAIRE",
                "niv4": "MUCODERM",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 319,
        "notification": ""
    },
    {
        "reference": "710210",
        "designation": "mucoderm® poinçon - greffe (collagène) de tissu mou",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "MATRICES DE RECONSTRUCTION TISSULAIRE",
                "niv4": "MUCODERM",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 0,
        "notification": "Fin de vie"
    },
    {
        "reference": "721520",
        "designation": "NovaMag® membrane S 15x20 mm - membrane barrière synthétique en magnésium résorbable",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "NOVAMAG",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 185,
        "notification": ""
    },
    {
        "reference": "722030",
        "designation": "NovaMag® membrane M 20x30 mm - membrane barrière synthétique en magnésium résorbable",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "NOVAMAG",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 270,
        "notification": ""
    },
    {
        "reference": "723040",
        "designation": "NovaMag® membrane L 30x40 mm - membrane barrière synthétique en magnésium résorbable",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "NOVAMAG",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 320,
        "notification": ""
    },
    {
        "reference": "74000",
        "designation": "NovaMag® connector",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "VIS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 30,
        "notification": ""
    },
    {
        "reference": "74100402",
        "designation": "Vis de fixation  NovaMag®  XS 1,0  x 3,5 mm",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "VIS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 141,
        "notification": ""
    },
    {
        "reference": "74140701",
        "designation": "Vis de fixation  NovaMag® S 1,4  x 7 mm",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "VIS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 75,
        "notification": ""
    },
    {
        "reference": "74140901",
        "designation": "Vis de fixation  NovaMag® M 1,4  x 9 mm",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "VIS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 75,
        "notification": ""
    },
    {
        "reference": "74141101",
        "designation": "Vis de fixation  NovaMag® L 1,4  x 11 mm",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "VIS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 75,
        "notification": ""
    },
    {
        "reference": "74141301",
        "designation": "Vis de fixation  NovaMag® XL 1,4  x 13 mm",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "VIS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 75,
        "notification": ""
    },
    {
        "reference": "801520",
        "designation": "permamem® 15 x 20 mm - Membrane PTFE synthétique non résorbable",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "PERMAMEM",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 65,
        "notification": ""
    },
    {
        "reference": "802030",
        "designation": "permamem® 20 x 30 mm - Membrane PTFE synthétique non résorbable",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "PERMAMEM",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 91,
        "notification": ""
    },
    {
        "reference": "803040",
        "designation": "permamem® 30 x 40 mm - Membrane PTFE synthétique non résorbable",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "SOFT TISSUE PROGRAM ",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "PERMAMEM",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 127,
        "notification": ""
    },
    {
        "reference": "ATP38_MB",
        "designation": "Appareil de photothérapie à usage professionnel AZERTY",
        "codefamille": "DISTP",
        "famille": "Distribution P",
        "catalogueniv1": "ATP38",
        "catalogueniv2": "EQUIPEMENT",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "PHOTOBIOMODULATION",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 20900,
        "notification": ""
    },
    {
        "reference": "BT1001",
        "designation": "Pince pour vis de fixation NovaMag®",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "INSTRUMENTS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 139,
        "notification": ""
    },
    {
        "reference": "BT1002",
        "designation": "Outil de préparation pour NOVAMag® membrane",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "INSTRUMENTS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 77,
        "notification": ""
    },
    {
        "reference": "BT1003",
        "designation": "Ciseaux pour  NovaMag® membrane",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "INSTRUMENTS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 77,
        "notification": ""
    },
    {
        "reference": "BT1004",
        "designation": "Kit de foret NovaMag®",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "INSTRUMENTS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 92,
        "notification": ""
    },
    {
        "reference": "BT1005",
        "designation": "Plateau pour instruments NovaMag®",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BOTISS",
        "catalogueniv3": "NOVAMAG",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GAMME MAGNESIUM",
                "niv5": "INSTRUMENTS",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 199,
        "notification": ""
    },
    {
        "reference": "C11-102",
        "designation": "SERINGUE EASY-GRAFT CLASSIC+;  (3x0,4ML)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "GUIDOR",
        "catalogueniv3": "CLASSIC+",
        "catalogueniv4": "SERINGUE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GUIDOR EASY-GRAFT CLASSIC +",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 1,
        "stockdisponible": 1,
        "puttc": 335.544,
        "notification": ""
    },
    {
        "reference": "C11-105",
        "designation": "SERINGUE EASY-GRAFT CLASSIC+;  (1x0,4ML) ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "GUIDOR",
        "catalogueniv3": "CLASSIC+",
        "catalogueniv4": "SERINGUE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GUIDOR EASY-GRAFT CLASSIC +",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 11,
        "stockdisponible": 11,
        "puttc": 130,
        "notification": ""
    },
    {
        "reference": "C11-172",
        "designation": "Seringue easy-graft CLASSIC+ (3 x 0,25 ML)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "GUIDOR",
        "catalogueniv3": "CLASSIC+",
        "catalogueniv4": "SERINGUE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GUIDOR EASY-GRAFT CLASSIC +",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 0,
        "stockdisponible": 0,
        "puttc": 205,
        "notification": ""
    },
    {
        "reference": "C11-175",
        "designation": "Seringue easy-graft CLASSIC+ (0,25 ML)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "GUIDOR",
        "catalogueniv3": "CLASSIC+",
        "catalogueniv4": "SERINGUE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GUIDOR EASY-GRAFT CLASSIC +",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 1,
        "stockdisponible": 1,
        "puttc": 83,
        "notification": ""
    },
    {
        "reference": "C15-002",
        "designation": "EASY-GRAFT CRYSTAL (3x0.4ml)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "GUIDOR",
        "catalogueniv3": "CRYSTAL+",
        "catalogueniv4": "SERINGUE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GUIDOR EASY-GRAFT CRYSTAL",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 40,
        "stockdisponible": 40,
        "puttc": 333.276,
        "notification": ""
    },
    {
        "reference": "C15-005",
        "designation": "EASY-GRAFT CRYSTAL (1x0.4ml)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "GUIDOR",
        "catalogueniv3": "CRYSTAL+",
        "catalogueniv4": "SERINGUE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GUIDOR EASY-GRAFT CRYSTAL",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 33,
        "stockdisponible": 33,
        "puttc": 130.8,
        "notification": ""
    },
    {
        "reference": "C15-112",
        "designation": "SERINGUE EASY GRAFT CRYSTAL+;  (3x0.15ml)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "GUIDOR",
        "catalogueniv3": "CRYSTAL+",
        "catalogueniv4": "SERINGUE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GUIDOR EASY-GRAFT CRYSTAL +",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 40,
        "stockdisponible": 40,
        "puttc": 233.172,
        "notification": ""
    },
    {
        "reference": "C15-115",
        "designation": "SERINGUE EASY GRAFT CRYSTAL+; (1x0.15ml)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "GUIDOR",
        "catalogueniv3": "CRYSTAL+",
        "catalogueniv4": "SERINGUE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "SYNTHETIQUES",
                "niv4": "GUIDOR EASY-GRAFT CRYSTAL +",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 51,
        "stockdisponible": 51,
        "puttc": 94.404,
        "notification": ""
    },
    {
        "reference": "INC27G37",
        "designation": "MAGIC NEEDLE – 27G Ø0.40 x37mm + 26G Ø0.45 x 12mm",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "DISTRIBUTION",
        "catalogueniv2": "NEEDLE",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "ACIDE HYALURONIQUE",
                "niv3": "CANULES",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 37,
        "stockdisponible": 36,
        "puttc": 110,
        "notification": ""
    },
    {
        "reference": "MINX-CAN0-25GR",
        "designation": "MinerOss X Cancellous, Particle Size, 250-1000 microns 0.25g/0.6cc",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS X",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 37,
        "stockdisponible": 37,
        "puttc": 65.94,
        "notification": ""
    },
    {
        "reference": "MINX-CAN0-25GRL",
        "designation": "MinerOss X Cancellous, Particle Size, 1000-2000 microns 0.25g/0.9cc   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS X",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 5,
        "stockdisponible": 5,
        "puttc": 78.25,
        "notification": ""
    },
    {
        "reference": "MINX-CAN0-5GR",
        "designation": "MinerOss X Cancellous, Particle Size, 250-1000 microns 0.5g/1.2cc   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS X",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 31,
        "stockdisponible": 31,
        "puttc": 87.35,
        "notification": ""
    },
    {
        "reference": "MINX-CAN0-5GRL",
        "designation": "MinerOss X Cancellous, Particle Size, 1000-2000 microns 0.5g/1.7cc   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS X",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 3,
        "stockdisponible": 3,
        "puttc": 92.31,
        "notification": ""
    },
    {
        "reference": "MINX-CAN1-0GR",
        "designation": "MinerOss X Cancellous, Particle Size, 250-1000 microns 1.0g/2.4cc   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS X",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 5,
        "stockdisponible": 5,
        "puttc": 157.37,
        "notification": ""
    },
    {
        "reference": "MINX-CAN1-0GRL",
        "designation": "MinerOss X Cancellous, Particle Size, 1000-2000 microns 1.0g/3.4cc   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS X",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 2,
        "stockdisponible": 2,
        "puttc": 157.37,
        "notification": ""
    },
    {
        "reference": "MINX-CAN2-0GR",
        "designation": "MinerOss X Cancellous, Particle Size, 250-1000 microns 2.0g/4.7cc   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS X",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 2,
        "stockdisponible": 2,
        "puttc": 280.45,
        "notification": ""
    },
    {
        "reference": "MINX-CAN2-0GRL",
        "designation": "MinerOss X Cancellous, Particle Size, 1000-2000 microns 2.0g/6.8cc   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS X",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 2,
        "stockdisponible": 2,
        "puttc": 271.66,
        "notification": ""
    },
    {
        "reference": "MINX-SYR0-5",
        "designation": "MinerOss X Syringe Particle Size, 250-1000 microns 0.5cc    ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS X",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 5,
        "stockdisponible": 5,
        "puttc": 92.31,
        "notification": ""
    },
    {
        "reference": "MINXP-CAN0-5SM",
        "designation": "MinerOss XP Cancellous, 0.5cc, 0.25 - 1mm particle size   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS XP",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 100,
        "stockdisponible": 100,
        "puttc": 65.9375,
        "notification": ""
    },
    {
        "reference": "MINXP-CAN1-0LG",
        "designation": "MinerOss XP Cancellous, 1.0cc, 1 - 2mm particle size  ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS XP",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 22,
        "stockdisponible": 22,
        "puttc": 87.0375,
        "notification": ""
    },
    {
        "reference": "MINXP-CAN1-0SM",
        "designation": "MinerOss XP Cancellous, 1.0cc, 0.25 - 1mm particle size    ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS XP",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 50,
        "stockdisponible": 50,
        "puttc": 87.0375,
        "notification": ""
    },
    {
        "reference": "MINXP-CAN2-0LG",
        "designation": "MinerOss XP Cancellous, 2.0cc, 1 - 2mm particle size   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS XP",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 20,
        "stockdisponible": 20,
        "puttc": 157.3743,
        "notification": ""
    },
    {
        "reference": "MINXP-CAN2-0SM",
        "designation": "MinerOss XP Cancellous, 2.0cc, 0.25 - 1mm particle size    ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS XP",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 27,
        "stockdisponible": 27,
        "puttc": 157.3743,
        "notification": ""
    },
    {
        "reference": "MINXP-CAN4-0SM",
        "designation": "MinerOss XP Cancellous, 4.0cc, 0.25 - 1mm particle size   ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS XP",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 10,
        "stockdisponible": 10,
        "puttc": 280.4506,
        "notification": ""
    },
    {
        "reference": "MINXP-SYR0-5",
        "designation": "MinerOss XP Syringe Cancellous, 0.5cc  ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "CAMLOG",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "MINEROSS XP",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 22,
        "stockdisponible": 22,
        "puttc": 92.3125,
        "notification": ""
    },
    {
        "reference": "NC0701EZC1525",
        "designation": "Membrane de collagène résorbable 15x25mm ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BIOMATLANTE",
        "catalogueniv3": "NEA COVA",
        "catalogueniv4": "MEMBRANE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "NEA COVA",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 80,
        "stockdisponible": 80,
        "puttc": 132,
        "notification": ""
    },
    {
        "reference": "NC0702EZC2030",
        "designation": "Membrane de collagène résorbable 20x30mm ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BIOMATLANTE",
        "catalogueniv3": "NEA COVA",
        "catalogueniv4": "MEMBRANE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "NEA COVA",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 14,
        "stockdisponible": 14,
        "puttc": 162,
        "notification": ""
    },
    {
        "reference": "NC0703EZC3040",
        "designation": "Membrane de collagène résorbable 30x40mm ",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "BIOMATLANTE",
        "catalogueniv3": "NEA COVA",
        "catalogueniv4": "MEMBRANE",
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "MEMBRANES ET MATRICES",
                "niv3": "XENOGREFFES",
                "niv4": "NEA COVA",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 73,
        "stockdisponible": 73,
        "puttc": 195,
        "notification": ""
    },
    {
        "reference": "P/1",
        "designation": "Pluryal classic (1 seringue 1ml)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "DISTRIBUTION",
        "catalogueniv2": "PLURYAL",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "ACIDE HYALURONIQUE",
                "niv3": "FILLERS",
                "niv4": "PLURYAL CLASSIC",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 86,
        "stockdisponible": 86,
        "puttc": 84,
        "notification": ""
    },
    {
        "reference": "PAT1X1X1",
        "designation": "COLLAPATII Cubes 10*1 (boite de 5)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "SYMATHESE",
        "catalogueniv3": "COLLAPATH",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "COLLAPAT",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 53,
        "stockdisponible": 53,
        "puttc": 291,
        "notification": ""
    },
    {
        "reference": "PAT35X6",
        "designation": "COLLAPATII 35*6",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "BIOMATERIAUX",
        "catalogueniv2": "SYMATHESE",
        "catalogueniv3": "COLLAPATH",
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "GREFFES OSSEUSES",
                "niv3": "XENOGREFFES",
                "niv4": "COLLAPAT",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 39,
        "stockdisponible": 39,
        "puttc": 228,
        "notification": ""
    },
    {
        "reference": "PBV",
        "designation": "Pluryal® Biovolume (1x1ml)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "DISTRIBUTION",
        "catalogueniv2": "PLURYAL",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "ACIDE HYALURONIQUE",
                "niv3": "FILLERS",
                "niv4": "PLURYAL BIOVOLUME",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 42,
        "stockdisponible": 42,
        "puttc": 104,
        "notification": ""
    },
    {
        "reference": "PCL",
        "designation": "Pluryal classic lidocaine (1 seringue 1ml)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "DISTRIBUTION",
        "catalogueniv2": "PLURYAL",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "ACIDE HYALURONIQUE",
                "niv3": "FILLERS",
                "niv4": "PLURYAL LIDOCAINE CLASSIC",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 145,
        "stockdisponible": 145,
        "puttc": 104,
        "notification": ""
    },
    {
        "reference": "PV/1",
        "designation": "Pluryal volume (1 seringue 1ml)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "DISTRIBUTION",
        "catalogueniv2": "PLURYAL",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "ACIDE HYALURONIQUE",
                "niv3": "FILLERS",
                "niv4": "PLURYAL VOLUME",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 58,
        "stockdisponible": 58,
        "puttc": 94,
        "notification": ""
    },
    {
        "reference": "PVL",
        "designation": "Pluryal volume lidocaine (1 seringue 1ml)",
        "codefamille": "DISTL",
        "famille": "Distribution L",
        "catalogueniv1": "DISTRIBUTION",
        "catalogueniv2": "PLURYAL",
        "catalogueniv3": null,
        "catalogueniv4": null,
        "diametrecorp": "",
        "longueur": ".000",
        "hauteur": ".000",
        "diamexterne": ".000",
        "col": "",
        "angulation": "",
        "taille": "",
        "marketing": {
            "catalogue1": {
                "niv1": "SOLUTIONS REGENERATRICES",
                "niv2": "ACIDE HYALURONIQUE",
                "niv3": "FILLERS",
                "niv4": "PLURYAL LIDOCAINE VOLUME",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue2": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            },
            "catalogue3": {
                "niv1": "",
                "niv2": "",
                "niv3": "",
                "niv4": "",
                "niv5": "",
                "niv6": "",
                "niv7": ""
            }
        },
        "suivistock": "Article géré",
        "suivistocktype": "Par lot",
        "stockphysique": 51,
        "stockdisponible": 41,
        "puttc": 132,
        "notification": ""
    }
]
export const stockAlertAdd = (itemAdded, alertArray) => {

    if (itemAdded.stockdisponible < 1 ) {
        toast(
            (t) => (
                <div>
                    <p>
                        Nos stocks pour l'article {itemAdded.reference} sont insuffisants
                        pour satisfaire votre commande.{" "}
                    </p>
                    <p>
                        Vous pouvez néanmoins conserver l'article dans votre panier, un
                        reste à livrer sera généré automatiquement et les articles vous
                        seront envoyés dès leur réassort.
                    </p>
                    <div>
                        <button
                            style={{
                                padding: "15px",
                                background: "transparent",
                                fontSize: "inherit",
                                fontFamily: "inherit",
                                cursor: "pointer",
                            }}
                            onClick={() => toast.dismiss(t.id)}
                        >
                            J'ai compris
                        </button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                icon: <WarningIcon sx={{color: orange[500]}} fontSize="large"/>,
                style: {
                    maxWidth: "450px",
                },
            }
        );
        alertArray.push({
            reference: itemAdded.reference,
        });
    }
};

export const stockAlertUpdate = (itemAdded, itemAddedQuantity, alertArray) => {
    if (itemAdded.stockdisponible < itemAddedQuantity ) {
        if (!alertArray.find((item) => item.reference === itemAdded.reference)) {
            toast(
                (t) => (
                    <div>
                        <p>
                            Nos stocks pour l'article {itemAdded.reference} sont insuffisants
                            pour satisfaire votre commande.{" "}
                        </p>
                        <p>
                            Vous pouvez néanmoins conserver l'article dans votre panier, un
                            reste à livrer sera généré automatiquement et les articles vous
                            seront envoyés dès leur réassort.
                        </p>
                        <div>
                            <button
                                style={{
                                    padding: "15px",
                                    background: "transparent",
                                    fontSize: "inherit",
                                    fontFamily: "inherit",
                                    cursor: "pointer",
                                }}
                                onClick={() => toast.dismiss(t.id)}
                            >
                                J'ai compris
                            </button>
                        </div>
                    </div>
                ),
                {
                    duration: Infinity,
                    icon: <WarningIcon sx={{color: orange[500]}} fontSize="large"/>,
                    style: {
                        maxWidth: "450px",
                    },
                }
            );
            alertArray.push({
                reference: itemAdded.reference,
            });
        }
    }
};

export const createX3Devis = (actionType, head, lines) => {
    const linesData = lines.map(
        (item) => `L;${item.reference};${item.unite};${item.cartQuantity};;|`
    );
    return encodeURIComponent(
        JSON.stringify({
            action: actionType,
            donnees: `E;CRAP;${head.type};;${
                head.clientCode
            };${todayDate()};;CRAP;EUR;;;;;|${linesData.join("")}END`,
        })
    );
};

export const createX3Credits = (actionType, head, lines) => {
    const linesData = lines.map(
        (item) =>
            `L;${item.reference};${item.designation};${item.designation.replaceAll(
                ";",
                "-"
            )};${item.unite};${item.cartQuantity};;|`
    );
    return encodeURIComponent(
        JSON.stringify({
            action: actionType,
            donnees: `E;CRAP;${head.type};;${
                head.clientCode
            };${todayDate()};${todayDate()};${
                head.shippingAddress
            };CRAP;EUR;;;;;|${linesData.join("")}END`,
        })
    );
};

export const createX3Commande = (actionType, head, lines) => {
    const linesData = lines.map(
        (item) =>
            `L;${item.reference};${item.designation.replaceAll(
                ";",
                "-"
            )};${item.designation.replaceAll(";", "-")};${item.unite};${
                item.cartQuantity
            };${item.prixbrut};${item.remise1montant};${item.remise2montant};;;|`
    );
    return encodeURIComponent(
        JSON.stringify({
            action: actionType,
            donnees: `E;CRAP;SON;;${head.clientCode};${todayDate()};${todayDate()};${
                head.shippingAddress
            };CRAP;EUR;;;;;|${linesData.join("")}END`,
        })
    );
};

export const createX3Address = (head, lines) => {
    return encodeURIComponent(
        JSON.stringify({
            action: "ZBPDLVADDR",
            donnees: `B;${head.clientCode};${head.addressNumber}|A;${head.addressNumber};${lines.designation};${lines.address};${lines.address2};${lines.address3};${lines.zipCode};${lines.city};FR;FR;${lines.phone};${lines.fax};Non|D;CRAP;${head.clientCode};TNT;${head.addressNumber}|END`,
        })
    );
};

export const sortOrderAndCredit = (cart) => {
    const order = cart.filter((item) => item.typedocument === "SON");
    const dcicp = cart.filter((item) => item.typedocument === "DCICP");
    const dcpil = cart.filter((item) => item.typedocument === "DCPIL");

    return {order: order, dcicp: dcicp, dcpil: dcpil};
};

export const stringAvatar = (name, color) => {
    return {
        sx: {
            bgcolor: color,
        },
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
};
