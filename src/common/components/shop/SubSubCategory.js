import {IoIosAddCircleOutline, IoIosRemoveCircleOutline} from "react-icons/io";
import {useState} from "react";

const SubSubCategory = ({
                            item,
                            getSortParams,
                            setActiveSort,
                            prevItem,
                            prevPrevItem,
                            subActive,
                            index,
                            setCurrentPage
                        }) => {

    const [subSubActive, setSubSubActive] = useState(false);

    const handleActive = () => {
        subSubActive ? setSubSubActive(false) : setSubSubActive(true);

    }

    const Icon = () => {
        if (!subSubActive) {
            return (
                <IoIosAddCircleOutline className="plus-icon"
                                       onClick={() => handleActive(item)}/>
            )
        }
        if (subSubActive) {
            return (
                <IoIosRemoveCircleOutline className="plus-icon__green"
                                          onClick={() => handleActive(item)}/>
            )
        }
    }

    const itemNiv3 = item.niv1;

    return (

        <ul className={`sub-category ${subActive ? `d-flex` : 'd-none'}`}>
            <li key={index}>
                <IoIosAddCircleOutline className="no-icon"/>
                <button className="category-button-margin pb-3"
                        onClick={(e) => {
                            getSortParams("category", [prevItem, prevPrevItem, itemNiv3]);
                            setCurrentPage(1)
                            setActiveSort(e);
                        }}
                >
                    {itemNiv3.toLowerCase()}
                </button>
            </li>
        </ul>
    )

}

export default SubSubCategory;