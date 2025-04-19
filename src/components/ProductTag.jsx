import React from 'react';

const ProductTags = ({ tags }) => {
  return (
    <div className="tags-list mt-2">
      {tags.map((tag, index) => (
        <div key={index} className="tag-item">
          {tag}
        </div>
      ))}
    </div>
  );
};

export default ProductTags;
