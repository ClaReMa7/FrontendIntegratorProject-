/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";
import  BackButton from "/img/back-button.png"

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/products/${id}`
        );
        setProduct(response.data.response);
      } catch (error) {
        console.error("Error al obtener el detalle del product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#730f06]"></div>
        <p className="text-2xl">Cargando...</p>
      </div>
    );
  }

  if (!product) return <div>Loading...</div>;

  const productImages = product.imageUrls;
  const previewImages = productImages.slice(1, 5);

  // Función para abrir la galería en la imagen seleccionada
  const openGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  // Función para cerrar la galería
  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  // Función para cambiar de imagen
  const changeImage = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return productImages.length - 1;
      if (newIndex >= productImages.length) return 0;
      return newIndex;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen pt-28 relative">
      <div className="flex justify-between items-center">
        {/* Nombre del producto */}
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

        {/* Botón para volver */}
        <button
          onClick={() => navigate(-1)}
          className="text-3xl hover:text-gray-700"
        >
          <img
            src={BackButton}
            alt="Volver"
            className="w-8 h-8"
          />
        </button>
      </div>

      {/* Descripción y detalles */}
      <p className="text-gray-700 mt-2">{product.description}</p>

      <p className="mt-2 font-semibold text-lg">
        Precio por unidad:
        <span className="text-red-600"> ${product.price}</span>
      </p>
      <p className="text-gray-600">Unidades disponibles: {product.stock}</p>

      {/* Galería de imágenes */}
      <div className="mt-6 flex flex-col md:flex-row gap-6">
        {/* Imagen principal */}
        <div className="flex-1">
          <img
            src={productImages[0]}
            alt={product.name}
            className="w-100 h-100 object-cover rounded-xl shadow-md hover:opacity-75"
            onClick={() => openGallery(0)}
          />
        </div>

        {/* Grilla de imágenes secundarias */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {[
            ...previewImages,
            ...(previewImages.length < 4 ? [productImages[0]] : []),
          ].map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} ${index}`}
              className="w-full h-full object-cover rounded-xl  shadow-md cursor-pointer hover:opacity-75"
              onClick={() => openGallery(index + 1)}
            />
          ))}
          <button
            className="w-full px-6 py-2 bg-[#B08562] text-[#1E1E1E] font-semibold rounded-lg hover:bg-[#D9C6B0]"
            onClick={() => openGallery(0)}
          >
            Ver galería
          </button>
          <button className="w-full px-6 py-2 bg-[#730F06] text-[#D4BDA8] font-semibold rounded-lg hover:bg-red-800">
            Reservar
          </button>
        </div>
      </div>

      {/* Modal de galería */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          {/* Imagen principal en el modal */}
          <button
            onClick={closeGallery}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300"
          >
            ✖
          </button>

          <button
            onClick={() => changeImage(-1)}
            className="absolute left-10 text-white text-4xl hover:text-gray-300"
          >
            ◀
          </button>

          <img
            src={productImages[currentImageIndex]}
            alt={`Imagen ${currentImageIndex}`}
            className="max-w-[80%] max-h-[80%] rounded-lg shadow-lg"
          />

          <button
            onClick={() => changeImage(1)}
            className="absolute right-10 text-white text-4xl hover:text-gray-300"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
