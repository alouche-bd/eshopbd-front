import {Link} from "react-router-dom";

const SubLevel = ({prevLevel, level, image}) => {
    return (
        <li className="sub-menu--mega__title">
            <Link to={`/catalogue/${encodeURIComponent(prevLevel.libelle)}/${encodeURIComponent(level.libelle)}`}>
                <a>{level.libelle}</a>
            </Link>
            {level.niveau3 && (

                <ul className="sub-menu--mega__list">
                    {level.niveau3.map((link, index) => (
                        <li>
                            <Link
                                to={`/catalogue/${encodeURIComponent(prevLevel.libelle)}/${encodeURIComponent(level.libelle)}/${encodeURIComponent(link.libelle)}`}>
                                <a>{link.libelle.toLowerCase()}</a>
                            </Link>
                            {link.niveau4 &&
                                <ul className="sub-menu--mega__list__two">
                                    {link.niveau4.map((link2, index) => (
                                        <li>
                                            <Link
                                                to={`/catalogue/${encodeURIComponent(prevLevel.libelle)}/${encodeURIComponent(level.libelle)}/${encodeURIComponent(link.libelle)}/${encodeURIComponent(link2.libelle)}`}>
                                                <a className="last-nav">{link2.libelle.toLowerCase()}</a>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </li>
                    ))}
                </ul>


            )}
        </li>
    )
}

export default SubLevel