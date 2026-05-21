import {IoIosSearch} from "react-icons/io";
import {useHistory} from "react-router";
import {useState} from "react";

const MobileMenuSearch = ({getActiveStatus}) => {
    const {push} = useHistory();

    const [searchInput, setSearchInput] = useState("");

    const handleClick = () => {
        getActiveStatus(false)
        push(`/search-results?query=${searchInput}`);
    };

    return (
        <div className="offcanvas-mobile-menu__search">
            <input type="search" placeholder="Que recherchez vous ?" onChange={(e) => setSearchInput(e.target.value)}/>
            <button onClick={handleClick}>
                <IoIosSearch/>
            </button>
        </div>
    );
};

export default MobileMenuSearch;
