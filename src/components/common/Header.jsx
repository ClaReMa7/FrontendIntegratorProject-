import { useState, useEffect } from "react";
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
  const [displayName, setDisplayName] = useState("Usuario");

  const { user, isAuthenticated, logout } = useAuth();

  // Extract display name from user or token data
  // useEffect(() => {
  //   if (isAuthenticated && user) {
  //     // First try to get name from user object if it exists
  //     if (user.name || user.firstName || user.fullName) {
  //       setDisplayName(user.name || user.firstName || user.fullName);
  //     }
  //     // Fall back to email from token subject
  //     else if (user.sub) {
  //       // Extract username part from email (everything before @)
  //       const emailUsername = user.sub.split('@')[0];
  //       // Capitalize first letter
  //       setDisplayName(emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1));
  //     }
  //     // Last resort: try email directly
  //     else if (user.email) {
  //       const emailUsername = user.email.split('@')[0];
  //       setDisplayName(emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1));
  //     }
  //   } else {
  //     setDisplayName("Usuario");
  //   }
  // }, [user, isAuthenticated]);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#3e0b05] shadow-[0_2px_15px_-3px_rgba(115,15,6,0.2)] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Name */}
            <Link
              to={"/"}
              className="group flex items-center space-x-3 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center space-x-3">
                <img src={Logo1} alt="Logo" className="w-10 h-10" />
                <span className="text-[#b08562] text-xl font-bold hidden sm:block">
                  Clave &amp; Compas
                </span>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#d9c6b0] hover:text-[#b08562] transition-colors p-2 rounded-lg hover:bg-[#730f06]/20"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              {isAuthenticated ? (
                <UserMenu
                  user={user}
                  // displayName={displayName}
                  onLogout={logout}
                />
              ) : (
                <>
                  <Button onClick={openLoginModal} variant="primary">
                    Iniciar Sesión
                  </Button>
                  <Button variant="outline">Registrarse</Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } sm:hidden border-t border-[#757575] py-4 space-y-3`}
          >
            {isAuthenticated ? (
              <div className="px-4">
                <UserMenu
                  user={user}
                  // displayName={displayName}
                  onLogout={logout}
                />
              </div>
            ) : (
              <>
                <Button onClick={openLoginModal}>Iniciar Sesión</Button>
                <Button variant="outline">Registrarse</Button>
              </>
            )}
          </div>
        </div>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}

export default Header;
