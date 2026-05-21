import Swiper from "react-id-swiper";

const MenuGallery = ({images}) => {

    const gallerySwiperParams = {

        autoplay: {
            delay: 3500,
        },
        observeParents: true,
        observer: true
    };
    return (
        <div className="product-quickview__image-wrapper">
            <Swiper {...gallerySwiperParams}>
                {images &&
                    images.map((single, key) => {
                        return (
                            <div key={key}>
                                <div className="single-image">
                                    <img
                                        src={single.url}
                                        className="img-fluid h-75"
                                        alt=""
                                    />
                                </div>
                            </div>
                        );
                    })}
            </Swiper>
        </div>
    )
}

export default MenuGallery;