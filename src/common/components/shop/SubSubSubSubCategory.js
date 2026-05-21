const SubSubSubSubCategory = ({item, getSortParams, setActiveSort, subSubSubActive, index}) => {

    return (

        <ul className={`sub-category ${subSubSubActive ? `d-flex` : 'd-none'}`}>
            <li key={index}>
                <button className="category-button-margin p-3"
                        onClick={(e) => {
                            getSortParams("category", item.niv1);
                            setActiveSort(e);
                        }}
                >
                    {item.niv1.toLowerCase()}
                </button>
            </li>
        </ul>
    )

}

export default SubSubSubSubCategory;