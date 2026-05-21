import {useEffect, useRef, useState} from "react";

const useFadeInRef = () => {
    const domRef = useRef();
    const [isVisible, setVisible] = useState(true);

    useEffect(() => {
        let refCleanup = domRef.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => setVisible(entry.isIntersecting));
        });
        observer.observe(domRef.current);
        return () => {
            if (refCleanup) {
                observer.unobserve(refCleanup);
            }
        };
    }, [domRef, isVisible]);

    return [domRef, isVisible];
};

export default useFadeInRef;
