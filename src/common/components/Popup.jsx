import popup from '../../assets/img/pop_up.png'
import {useRef, useState} from "react";
import useOnClickOutside from "../utils/useOnClickOutsideRef";
import {FaTimes} from "react-icons/all";

const Popup = () => {
    const isPopUp = localStorage.getItem('popUp')

    const ref = useRef();

    useOnClickOutside(ref, () => setShow(false));

    const [show, setShow] = useState(false);

    if (!isPopUp) {
        setShow(true)
        localStorage.setItem('popUp', 'yes')
    }

    if (show) {
        return (
            <div className="pop-up">
                <FaTimes className="close-pop-up" onClick={() => setShow(false)}/>
                <img src={popup} alt="delay" ref={ref}/>
            </div>
        )
    } else {
        return null;
    }
}

export default Popup