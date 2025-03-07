// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../components/common/PaginationComponent"; // Reutilizamos el componente
import Button from "../components/common/Button";
import CardsContainer from "../components/containers/CardsContainer";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function Home() {
  const [randomProducts, setRandomProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const categories = [
    { id: 1, name: "Cuerda" },
    { id: 2, name: "Percusión" },
    { id: 3, name: "Viento" },
    { id: 4, name: "Electrónicos" },
    { id: 5, name: "Otros" }
  ];

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      // Convertir de UI (base 1) a API (base 0)
      const apiPage = page - 1;
      
      const response = await fetch(
        `${API_URL}/products?page=${apiPage}&pageSize=10`
      );
      
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Respuesta de la API:", data);
      
      // Actualizar estados con los datos recibidos
      setAllProducts(data.response.content || []);
      setTotalPages(data.response.totalPages || 1);
      
      // Opcional: verificar si la página actual coincide con la que devuelve la API
      const apiReturnedPage = (data.response.number || 0) + 1; // Convertir de base 0 a base 1
      if (apiReturnedPage !== page && apiReturnedPage > 0) {
        setCurrentPage(apiReturnedPage);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]); // Se ejecuta cuando cambia la página

  useEffect(() => {
    let filtered = allProducts;

    if (selectedCategory) {
      filtered = filtered.filter(product => product.idCategory === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, allProducts]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      const shuffled = shuffleArray([...filteredProducts]);
      setRandomProducts(shuffled.slice(0, 10));
    }
  }, [filteredProducts]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.elements.search.value);
  };

  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <main className="bg-[#F9F7F4] min-h-screen text-[#1e1e1e]">
      {/* Sección Hero */}
      <section className="bg-[#d9c6b0] text-center p-10 text-white">
        <div className="hero-content">
          <h1 className="text-3xl text-[#730f06] font-bold">Bienvenido a Clave &amp; Compas</h1>
          <p className="text-lg text-[#b08562] mt-2">Tu ritmo, nuestro sonido.</p>
          <form className="flex justify-center mt-4" onSubmit={handleSearch}>
            <input
              type="text"
              name="search"
              className="w-full max-w-xs p-2 border text-[#757575] border-[#b08562] bg-[#F9F7F4] rounded-lg focus:outline-none focus:border-[#730f06] mr-2 ml-2 "
              placeholder="Buscar productos..."
            />

            <Button variant="accent">
              Buscar
            </Button>
          </form>
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="flex flex-wrap justify-center gap-4 p-6 bg-[#F9F7F4] outline outline-1 outline-[#b08562]">
      <button
          onClick={handleResetFilters}
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === null ? "bg-[#b08562] text-white" : "text-[#b08562] hover:bg-[#c6bcb049]"
          }`}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`text-[#b08562] px-4 py-2 rounded-lg hover:bg-[#c6bcb049] ${
              selectedCategory === category.id ? "bg-[#b08562] text-white" : ""
            }`}
          >
            {category.name}
          </button>
        ))}
      </section>
      
      {/* Indicador de carga */}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#730f06]"></div>
        </div>
      )}

      

        <CardsContainer products={randomProducts} handleViewDetail={handleViewDetail} />
          
        
        {/* Paginación solo en la parte inferior */}
        {totalPages > 1 && (
          <div className="flex justify-center my-4">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
        
      

      {/* Botón para volver arriba */}
      <div className="bg-[#f1eae7] flex justify-center py-4">
        <button
          className="bg-[#730f06] text-[#d9c6b0] px-4 py-2 rounded-lg hover:bg-[#3e0b05]"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ Volver arriba
        </button>
      </div>
    </main>
  );
}

export default Home;