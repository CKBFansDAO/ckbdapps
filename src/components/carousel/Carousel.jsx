import React, { useState, useEffect } from 'react';

const Carousel = ({ images, interval, onImageClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => {
            clearInterval(intervalId);
        };
    }, [images, interval]);

    const handleImageClick = (index) => {
        setCurrentIndex(index);
        if (onImageClick) {
            onImageClick(index);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="relative w-full" style={{ paddingBottom: '50%' }}>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Image ${index + 1}`}
                        className={`absolute w-full h-full rounded-[15px] hover:cursor-pointer object-cover transition-opacity duration-300 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={() => handleImageClick(index)}
                    />
                ))}
            </div>
            <div className="carousel-navigation flex justify-center space-x-2 mt-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 bg-gray-400 rounded-full cursor-pointer hover:bg-gray-600 ${index === currentIndex ? 'bg-gray-600 w-20 ' : 'w-5'
                            }`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;