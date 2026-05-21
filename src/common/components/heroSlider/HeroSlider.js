import Swiper from "react-id-swiper";
import {Col, Container, Row} from "react-bootstrap";

const HeroSlider = ({sliderData}) => {
    const params = {
        loop: true,
        speed: 1500,
        autoplay: {
            delay: 5000, disableOnInteraction: false,
        },
        effect: "fade",
        watchSlidesVisibility: true,
        navigation: {
            nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev"
        },
        renderPrevButton: () => (<button className="swiper-button-prev ht-swiper-button-nav"></button>),
        renderNextButton: () => (<button className="swiper-button-next ht-swiper-button-nav"></button>)
    };
    return (<div className="hero-slider-seven">
        <div className="hero-slider-seven__wrapper">
            <Swiper {...params}>
                {sliderData && sliderData.map((single, i) => {
                    return (<div
                        className="hero-slider-seven__slide bg-img"
                        style={{backgroundImage: `url(${single.bgImage})`}}
                        key={i}
                    >
                        <Container className="h-100">
                            <Row
                                className="content align-items-end flex-column flex-lg-row justify-content-center justify-content-lg-start">
                                <Col lg={5} className="mr-auto">
                                    <div className="hero-slider-seven__content">
                                        <h5 className="sub-title">{single.subtitle}</h5>
                                        <h1
                                            className="title"
                                            dangerouslySetInnerHTML={{__html: single.title}}
                                        />
                                        <div className="slider-link">
                                            <a href={single.url} target="_blank"
                                               className="lezada-button lezada-button--medium"
                                               rel="noreferrer"
                                            >
                                                Découvrir
                                            </a>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>);
                })}
            </Swiper>
        </div>
    </div>);
};

export default HeroSlider;