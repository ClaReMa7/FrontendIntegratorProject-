import { useEffect, useState } from "react";
import { InstrumentForm } from "../../components/instrument/InstrumentForm";
import { ListProduct } from "./ListProduct";
import "../../styles/AdminPanel.css"
import { Home, Package, Calendar, Users, Plus } from "lucide-react";

export const AdminPanel = () => {
  const [view, setView] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      alert("Este panel no está disponible en dispositivos móviles.");
    }
  }, []);

  return (
    <main className="min-h-screen grid grid-cols-[250px_1fr] bg-[#f1eae7] text-[#1e1e1e]">
      {/* Menú Lateral */}
      <aside className="bg-[#3e0b05] text-white p-6 flex flex-col gap-4 shadow-lg">
        <h3 className="text-xl text-center font-bold text-[#d9c6b0] mb-6 border-b border-[#b08562] pb-4">Panel de Administración</h3>
        
        <button 
          onClick={() => setView("home")}
          className={`btn-admin flex items-center gap-3 ${view === "home" ? "bg-[#730f06] text-white" : "bg-transparent text-[#d9c6b0] hover:bg-[#b08562] hover:text-white"} transition-colors duration-300 py-3 px-4 rounded-md shadow-sm`}
        >
          <Home size={18} />
          <span>Inicio</span>
        </button>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-admin flex items-center gap-3 bg-[#b08562] hover:bg-[#d9c6b0] hover:text-[#3e0b05] transition-colors duration-300 text-white py-3 px-4 rounded-md shadow-md mt-4"
        >
          <Plus size={18} />
          <span>Agregar Producto</span>
        </button>
        
        <button 
          onClick={() => setView("list")}
          className={`btn-admin flex items-center gap-3 ${view === "list" ? "bg-[#730f06] text-white" : "bg-transparent text-[#d9c6b0] hover:bg-[#b08562] hover:text-white"} transition-colors duration-300 py-3 px-4 rounded-md shadow-sm mt-2`}
        >
          <Package size={18} />
          <span>Listar Instrumentos</span>
        </button>
        
        <button 
          onClick={() => setView("manage-reservations")}
          className={`btn-admin flex items-center gap-3 ${view === "manage-reservations" ? "bg-[#730f06] text-white" : "bg-transparent text-[#d9c6b0] hover:bg-[#b08562] hover:text-white"} transition-colors duration-300 py-3 px-4 rounded-md shadow-sm mt-2`}
        >
          <Calendar size={18} />
          <span>Gestionar Reservas</span>
        </button>
        
        <button 
          onClick={() => setView("manage-users")}
          className={`btn-admin flex items-center gap-3 ${view === "manage-users" ? "bg-[#730f06] text-white" : "bg-transparent text-[#d9c6b0] hover:bg-[#b08562] hover:text-white"} transition-colors duration-300 py-3 px-4 rounded-md shadow-sm mt-2`}
        >
          <Users size={18} />
          <span>Gestionar Usuarios</span>
        </button>
        
        <InstrumentForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </aside>

      {/* Contenido */}
      <section className="p-6 bg-[#f1eae7] overflow-y-auto">
        {view === "home" && (
          <div className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto mt-10">
            <img src="/img/logo.png" alt="Logo de la App" className="w-60 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#730f06] mb-4">Bienvenido al Panel de Administración</h1>
            <p className="text-[#1e1e1e] mb-6">Selecciona una opción del menú lateral para comenzar a gestionar tu tienda.</p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="section-card bg-[#d9c6b0] p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-[#3e0b05]">Productos</h3>
                <p className="text-sm text-[#1e1e1e]">Gestión de inventario</p>
              </div>
              <div className="section-card bg-[#d9c6b0] p-4 rounded-lg shadow text-center hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-[#3e0b05]">Reservas</h3>
                <p className="text-sm text-[#1e1e1e]">Administra las reservas</p>
              </div>
            </div>
          </div>
        )}
        {view === "list" && (
          <div>
            <h3 className="text-2xl font-semibold text-[#3e0b05] mb-4 border-b-2 border-[#b08562] pb-2">Lista de Instrumentos</h3>
            <ListProduct />
          </div>
        )}
        {view === "manage-reservations" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-[#3e0b05] mb-4 border-b-2 border-[#b08562] pb-2">Gestión de Reservas</h3>
            <p className="text-[#1e1e1e]">Contenido de gestión de reservas en desarrollo.</p>
          </div>
        )}
        {view === "manage-users" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-[#3e0b05] mb-4 border-b-2 border-[#b08562] pb-2">Gestión de Usuarios</h3>
            <p className="text-[#1e1e1e]">Contenido de gestión de usuarios en desarrollo.</p>
          </div>
        )}
      </section>
    </main>
  );
};
