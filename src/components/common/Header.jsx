import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo1 from "/img/logo1.svg";
import Button from "./Button";
import LoginModal from "../login/LoginModal";
import { useAuth } from "../../context";
import UserMenu from "./UserMenu";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#3e0b05] shadow-[0_2px_15px_-3px_rgba(115,15,6,0.2)] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo y Nombre */}
            <Link to={"/"} className="group flex items-center space-x-3 transition-transform duration-300 hover:-translate-y-0.5">
              <img src={Logo1} alt="Logo" className="w-10 h-10" />
              <span className="text-[#b08562] text-xl font-bold hidden sm:block">
                Clave &amp; Compas
              </span>
            </Link>

            {/* Botón de menú móvil */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#d9c6b0] hover:text-[#b08562] transition-colors p-2 rounded-lg hover:bg-[#730f06]/20"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Menú en versión desktop */}
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              {isAuthenticated ? (
                <UserMenu user={user} onLogout={logout} />
              ) : (
                <>
                  <Button onClick={openLoginModal} variant="primary">
                    Iniciar Sesión
                  </Button>
                  <Link to="/registro">
                    <Button variant="outline">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Menú en versión móvil */}
          {isMenuOpen && (
            <div className="sm:hidden border-t border-[#757575] py-4 space-y-3">
              {isAuthenticated ? (
                <div className="px-4">
                  <UserMenu user={user} onLogout={logout} />
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <Button onClick={openLoginModal}>Iniciar Sesión</Button>
                  <Link to="/registro">
                    <Button variant="outline">Registrarse</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Modal de inicio de sesión */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}

export default Header;
