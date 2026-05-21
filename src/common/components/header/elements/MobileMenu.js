import {IoIosClose} from "react-icons/io";
import MobileMenuSearch from "./MobileMenuSearch";
import MobileMenuNav from "./MobileMenuNav";
import MobileMenuWidgets from "./MobileMenuWidgets";

const MobileMenu = ({activeStatus, getActiveStatus}) => {
    return (
        <div className={`offcanvas-mobile-menu ${activeStatus ? "active" : ""}`}>
            <div
                className="offcanvas-mobile-menu__overlay-close"
                onClick={() => getActiveStatus(false)}
            />
            <div className="offcanvas-mobile-menu__wrapper">
                <button
                    className="offcanvas-mobile-menu__close"
                    onClick={() => getActiveStatus(false)}
                >
                    <IoIosClose/>
                </button>
                <div className="offcanvas-mobile-menu__content-wrapper">
                    <div className="offcanvas-mobile-menu__content">
                        {/* mobile search */}
                        <MobileMenuSearch getActiveStatus={getActiveStatus}/>

                        {/* mobile nav menu */}
                        <MobileMenuNav getActiveStatus={getActiveStatus}/>

                        {/* <div className="offcanvas-mobile-menu__middle">
                            <div className="lang-curr-style space-mb--20">
                                <select>
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>*/}

                        {/* mobile widgets */}
                        <MobileMenuWidgets getActiveStatus={getActiveStatus}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
