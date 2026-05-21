import {IoIosAddCircleOutline, IoIosRemoveCircleOutline} from "react-icons/io";
import {useState} from "react";
import SubSubCategory from "./SubSubCategory";

const ChildrenSidebarCategory = ({item, getSortParams, setActiveSort, active, prevItem, index, setCurrentPage}) => {

    const [subActive, setSubActive] = useState(false);

    const handleActive = (index) => {
        subActive ? setSubActive(false) : setSubActive(true);

    }

    const Icon = () => {
        if (!subActive) {
            return (
                <IoIosAddCircleOutline className="plus-icon"
                                       onClick={() => handleActive(item)}/>
            )
        }
        if (subActive) {
            return (
                <IoIosRemoveCircleOutline className="plus-icon__green"
                                          onClick={() => handleActive(item)}/>
            )
        }
    }

    const itemNiv2 = item.niv1;

    return (

        <ul className={`sub-category ${active ? `d-flex` : 'd-none'}`}>
            <li key={index}>
                {item.niv2.length > 0 ?
                    <Icon/>
                    :
                    <IoIosAddCircleOutline className="no-icon"/>
                }
                <button className="category-button-margin"
                        onClick={(e) => {
                            getSortParams("category", [prevItem, itemNiv2]);
                            setCurrentPage(1)
                            setActiveSort(e);
                        }}
                >
                    {itemNiv2.toLowerCase()}
                </button>
                <div className="sub-category-container">
                    {item.niv2.length > 0 ? item.niv2.sort((a, b) => {
                        return a.niv1.localeCompare(b.niv1, undefined, {numeric: true, sensitivity: 'base'})
                    }).map((item, index) => (
                        <SubSubCategory index={index}
                                        subActive={subActive}
                                        prevItem={prevItem}
                                        prevPrevItem={itemNiv2}
                                        item={item}
                                        setActiveSort={setActiveSort}
                                        getSortParams={getSortParams}
                                        setCurrentPage={setCurrentPage}
                        />
                    )) : ""}
                </div>
            </li>
        </ul>
    )


}

export default ChildrenSidebarCategory;