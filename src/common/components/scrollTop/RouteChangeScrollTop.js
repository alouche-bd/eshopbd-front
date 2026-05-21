import {useLocation} from "react-router-dom";

export default function RouteChangeScrollTop() {
    const {pathname} = useLocation();

    /*   useEffect(() => {
      if (pathname !== "/") {
        window.scrollTo(0, (70 * window.innerHeight) / 100);
      }
    }, [pathname]);
   */
    return null;
}
