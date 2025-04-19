import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export default function ImageSlider({images}) {
  const settings = {
    dots: true,
    infinite: images.length > 1, // Solo permitir el bucle infinito si hay más de una imagen
    speed: 500,
    slidesToShow: 1, // Mostrar solo 1 imagen
    slidesToScroll: 1,
    centerMode: images.length > 1, // Activar centerMode solo si hay más de una imagen
    focusOnSelect: true,
  };

  return (
    <div className="image-slider-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="image-slide">
            <img
              src={image.url}
              alt={`Slide ${index + 1}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
