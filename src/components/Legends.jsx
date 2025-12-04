import React from 'react';
import { getAllCategories } from '../utils/colorUtils';

const Legends = () => {
    const categories = getAllCategories();

    return (
        <div className="map-legends">
            <div className="ispu-legend">
                {categories.map((category, index) => (
                    <div key={index} className="legend-item">
                        <span className="color-box" style={{ background: category.color }}></span>
                        <span>{category.range.min} - {category.range.max === Infinity ? '300+' : category.range.max} {category.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Legends;

