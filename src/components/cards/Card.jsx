import React from "react";

const Card = ({ product, onViewDetail }) => {
  return (
    <div
      className="cursor-pointer h-6/6 bg-white shadow-lg rounded-2xl p-6 "
      onClick={() => onViewDetail(product.idProduct)}
    >
      <img
        src={product.imageUrls[0]}
        alt={product.name}
        className="w-full h-60 object-cover rounded-md "
      />
       <div className="p-2  flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-[#1E1E1E]">{product.name}</h3>
        <p className="text-sm text-[#757575] line-clamp-3">{product.description}</p>
        <h2 className="text-lg font-bold text-[#730f06] mt-2">{`$${product.price}`}</h2>

      </div>
    </div>
  );
};

export default Card;