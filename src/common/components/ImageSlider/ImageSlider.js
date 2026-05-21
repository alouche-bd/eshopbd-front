import Swiper from "react-id-swiper";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {Col, Container, Row} from "react-bootstrap";

const ImageSliderTwo = ({imageSliderData}) => {
    const params = {
        loop: false,
        slidesPerView: 4,
        spaceBetween: 30,
        grabCursor: true,
        // autoplay: {
        //   delay: 5000,
        //   disableOnInteraction: false,
        // },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        renderPrevButton: () => (
            <button className="swiper-button-prev ht-swiper-button-nav">
                <IoIosArrowBack/>
            </button>
        ),
        renderNextButton: () => (
            <button className="swiper-button-next ht-swiper-button-nav">
                <IoIosArrowForward/>
            </button>
        ),

        breakpoints: {
            1024: {
                slidesPerView: 4
            },
            768: {
                slidesPerView: 3
            },
            576: {
                slidesPerView: 2
            },
            320: {
                slidesPerView: 1
            }
        }
    };
    return (
        <div className="image-slider-area space-mb--r130">
            <Container>
                <Row className="align-items-center">
                    <Col lg={12} className="order-2 order-lg-1 text-center">
                        <div className="instagram-title-container space-mb--r80">
                            <h4 className="title">NOS ACTUALITÉS</h4>
                            <h2 className="subtitle">@biotechdental</h2>
                        </div>
                        <div className="image-slider-wrapper">
                            <Swiper {...params}>
                                {imageSliderData &&
                                    imageSliderData.map((single, i) => {
                                        return (
                                            <div className="single-image text-center" key={i}>
                                                <a href={single.url} target="_blank">
                                                    <img
                                                        src={process.env.PUBLIC_URL + single.image}
                                                        className="img-fluid"
                                                        alt=""
                                                    />
                                                </a>
                                            </div>
                                        );
                                    })}
                            </Swiper>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ImageSliderTwo;
