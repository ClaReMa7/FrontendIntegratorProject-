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
  const [currentPage, setCurrentPage] = useState(1); // Página actual (UI base 1)
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      // Convertir de UI (base 1) a API (base 0)
      const apiPage = page - 1;
      
      const response = await fetch(
        `https://clavecompas-production.up.railway.app/clavecompas/products?page=${apiPage}&pageSize=10`
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
    if (allProducts.length > 0) {
      const shuffled = shuffleArray([...allProducts]);
      setRandomProducts(shuffled.slice(0, 10));
    }
  }, [allProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value;
    console.log("Buscar:", query);
    // Aquí podrías implementar la lógica de búsqueda real
  };

  const handleViewDetail = (productId) => {
    // Por ejemplo, navega a la ruta completa de galería
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
      <section className="flex flex-wrap justify-center gap-4 p-6 bg-[#F9F7F4] outline outline-1 outline-[#b08562] ">
        {["Cuerda", "Percusión", "Viento", "Audio Profesional", "Instrumentos Electrónicos"].map((category) => (
          <button 
            key={category} 
            className="text-[#b08562] px-4 py-2 rounded-lg hover:bg-[#c6bcb049]"
          >
            {category}
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