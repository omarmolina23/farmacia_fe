import React from "react";

const ColoredCube = ({ topColor, leftColor, rightColor }) => {
    return (
        <div className="w-20 h-20 transition-transform duration-300 transform hover:rotate-[5deg]">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {/* Parte superior */}
                <polygon
                    points="100,10 190,60 100,110 10,60"
                    fill={topColor}
                    className="transition-colors duration-300"
                />
                {/* Lado izquierdo */}
                <polygon
                    points="10,60 10,150 100,200 100,110"
                    fill={leftColor}
                    className="transition-colors duration-300"
                />
                {/* Lado derecho */}
                <polygon
                    points="190,60 190,150 100,200 100,110"
                    fill={rightColor}
                    className="transition-colors duration-300"
                />
            </svg>
        </div>
    );
};

export default ColoredCube;