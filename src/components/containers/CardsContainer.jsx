import React from "react";
import Card from "../cards/Card";
const CardsContainer = ({ products, handleViewDetail }) => {
    return (
      <section className="flex items-start justify-center min-h-screen p-8">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  w-full max-w-3xl gap-x-20 gap-y-8">
          {products.map((prod) => (
            <Card
              key={prod.idProduct}
              product={prod}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      </section>
    );
  };

export default CardsContainer;