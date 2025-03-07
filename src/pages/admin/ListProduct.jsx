import { useState, useEffect } from "react";
import instrumentService from "../../services/instrumentService";
import PaginationComponent from "../../components/common/PaginationComponent";
import "../../styles/ListProduct.css";
import { Trash2, Edit,  Eye, ShoppingCart } from "lucide-react";
import { successToast, errorToast } from "../../utils/toastNotifications";
import ConfirmationModal from "../../components/instrument/ConfirmationModal";
import { InstrumentForm } from "../../components/instrument/instrumentform/index"; // Importamos el formulario

export const ListProduct = () => {
    const [products, setAllProducts] = useState([]); // Almacena los productos
    const [currentPage, setCurrentPage] = useState(1); // Página actual en UI (base 1)
    const [totalPages, setTotalPages] = useState(1); // Total de páginas
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [productId, setProductId] = useState(null);
    
    // Estados para el modal de edición
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedInstrument, setSelectedInstrument] = useState(null);

    const fetchProducts = async (uiPage) => {
        // Convertimos de UI (base 1) a API (base 0)
        const apiPage = uiPage - 1;
        
        console.log(`Solicitando página ${apiPage} a la API (página ${uiPage} en UI)`);
        
        const data = await instrumentService.getInstrumenAll(apiPage, 10);
        console.log("Respuesta procesada:", data);
        
        setAllProducts(data.products);
        setTotalPages(data.totalPages);
        
        // Si la API devuelve la página actual (en base 0), la convertimos a base 1 para la UI
        if (data.currentPageIndex !== undefined) {
            const uiPageFromApi = data.currentPageIndex + 1;
            console.log(`API devolvió página ${data.currentPageIndex} (base 0), que es página ${uiPageFromApi} en UI (base 1)`);
            
            // Solo actualizamos si es diferente para evitar loops
            if (uiPageFromApi !== currentPage) {
                setCurrentPage(uiPageFromApi);
            }
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]); // Se ejecuta cuando cambia la página

    // Función para eliminar un producto
    const handleDelete = (id) => {
        instrumentService
            .deleteInstrument(id)
            .then(() => {
                fetchProducts(currentPage);
                successToast("Instrumento eliminado correctamente");
                console.log("Instrumento eliminado correctamente");
            })
            .catch((error) => {
                console.error("Error al eliminar el instrumento:", error);
                errorToast("Error al eliminar el instrumento");
            });
    };

    // Función para abrir modal de edición
    const handleOpenEditModal = (product) => {
        // Preparamos los datos del producto para el formato esperado por el formulario
        const formattedProduct = {
            id: product.idProduct,
            name: product.name,
            brand: product.brand,
            model: product.model,
            year: product.year,
            stock: product.stock,
            description: product.description,
            price: product.price,
            available: product.available,
            idCategory: product.idCategory,
            imageUrls: product.imageUrls || []
        };
        
        setSelectedInstrument(formattedProduct);
        setIsEditModalOpen(true);
    };

    // Función para cerrar modal de edición
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedInstrument(null);
        // Refrescamos los productos después de cerrar el modal (en caso de ediciones)
        fetchProducts(currentPage);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#d9c6b0] to-[#f1eae7]">
                <h2 className="text-2xl font-bold text-[#3e0b05] mb-4">Catálogo de Instrumentos</h2>
                <p className="text-[#1e1e1e] mb-4">Administra tu inventario de instrumentos musicales</p>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#3e0b05] text-white">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d9c6b0]">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.idProduct} className="hover:bg-[#f1eae7] transition-colors">
                                        <td className="p-3 text-[#1e1e1e]">{product.idProduct}</td>
                                        <td className="p-3 font-medium text-[#3e0b05]">{product.name}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                product.stock > 10 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : product.stock > 0 
                                                        ? 'bg-yellow-100 text-yellow-800' 
                                                        : 'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock} unidades
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => handleOpenEditModal(product)}
                                                    className="flex items-center justify-center text-[#3e0b05] bg-[#d9c6b0] hover:bg-[#b08562] hover:text-white p-2 rounded-md transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                
                                                <button
                                                    onClick={() => {
                                                        setIsConfirmationModalOpen(true);
                                                        setProductId(product.idProduct);
                                                    }}
                                                    className="flex items-center justify-center text-white bg-[#730f06] hover:bg-[#3e0b05] p-2 rounded-md transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                
                                                <button 
                                                    className="flex items-center justify-center text-[#1e1e1e] bg-[#f1eae7] hover:bg-[#d9c6b0] p-2 rounded-md transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-[#757575]">
                                        No hay productos disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </div>
            
            {/* Modal de confirmación para eliminar */}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onDelete={handleDelete}
                id={productId}
            />
            
            {/* Modal para editar instrumentos */}
            <InstrumentForm
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                instrumentToEdit={selectedInstrument}
            />
        </div>
    );
};

export default ListProduct;