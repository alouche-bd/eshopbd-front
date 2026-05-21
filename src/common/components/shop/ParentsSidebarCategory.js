import {IoIosAddCircleOutline, IoIosRemoveCircleOutline} from "react-icons/io";
import ChildrenSidebarCategory from "./ChildrenSidebarCategory";
import {useState} from "react";

const ParentsSidebarCategory = ({item, index, getSortParams, setActiveSort, setCurrentPage}) => {

    const [active, setActive] = useState(false);

    const handleActive = (item) => {
        active ? setActive(false) : setActive(true);

    }

    const Icon = () => {
        if (!active) {
            return (
                <IoIosAddCircleOutline className="plus-icon"
                                       onClick={() => handleActive(item)}/>
            )
        }
        if (active) {
            return (
                <IoIosRemoveCircleOutline className="plus-icon__green"
                                          onClick={() => handleActive(item)}/>
            )
        }
    }

    const itemNiv1 = item.niv1;

    return (
        <li key={index}>
            {item.niv2.length > 0 ?
                <Icon/>
                :
                <IoIosAddCircleOutline className="no-icon"/>
            }
            <button
                onClick={(e) => {
                    getSortParams("category", item.niv1);
                    setCurrentPage(1)
                    setActiveSort(e);
                }}
            >
                {itemNiv1}
            </button>
            <div className="sub-category-container">
                {item.niv2.length > 0 ? item.niv2.sort((a, b) => {
                    return a.niv1.localeCompare(b.niv1, undefined, {numeric: true, sensitivity: 'base'})
                }).map((item, index) => (

                    <ChildrenSidebarCategory index={index}
                                             item={item}
                                             prevItem={itemNiv1}
                                             getSortParams={getSortParams}
                                             setActiveSort={setActiveSort}
                                             active={active}
                                             setCurrentPage={setCurrentPage}
                    />

                )) : ""}
            </div>
        </li>
    )
}

export default ParentsSidebarCategory;