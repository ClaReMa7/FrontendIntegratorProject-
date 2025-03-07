import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { LogOut, Settings, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

function UserMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Use email from token subject if available
  const userEmail = user?.email || user?.sub || "usuario@example.com";

  // Handle clicking outside to close the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Get the initial of the user's first name
  const userInitial = user.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "";

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón principal mejorado */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2.5 rounded-xl 
          bg-gradient-to-r from-[#730f06] to-[#3e0b05]
          hover:from-[#8b1208] hover:to-[#4e0d06]
          text-[#d9c6b0] transition-all duration-300 
          shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#b08562] to-[#730f06] 
          flex items-center justify-center ring-2 ring-[#d9c6b0]/20 text-[#d9c6b0] font-bold"
        >
          {userInitial}
        </div>
        <span className="font-medium">{user.firstName}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menú desplegable mejorado */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-56 rounded-xl 
          bg-gradient-to-b from-[#730f06] to-[#3e0b05]
          shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-[#ffffff15]
          backdrop-blur-sm transform transition-all duration-300 scale-100 origin-top-right
          divide-y divide-[#ffffff15]"
        >
          {/* Sección de información del usuario */}
          <div className="p-4">
            <p className="text-[#b08562] text-sm truncate mt-0.5">
              {user.email}
            </p>
          </div>

          {/* Enlaces y opciones */}
          <div className="p-2">
            <Link
              to="/profile"
              className="flex items-center px-3 py-2.5 rounded-lg text-sm text-[#d9c6b0] 
                hover:bg-[#ffffff0a] transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Settings
                size={16}
                className="mr-3 text-[#b08562] group-hover:text-[#d9c6b0] transition-colors"
              />
              Mi perfil
            </Link>

            {user?.roles?.includes("ADMIN") && (
              <Link
                to="/admin"
                className="flex items-center px-3 py-2.5 rounded-lg text-sm text-[#d9c6b0] 
                  hover:bg-[#ffffff0a] transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <Settings
                  size={16}
                  className="mr-3 text-[#b08562] group-hover:text-[#d9c6b0] transition-colors"
                />
                Panel de administración
              </Link>
            )}
          </div>

          {/* Botón de cerrar sesión */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm text-[#d9c6b0] 
                hover:bg-[#5c1c14] transition-all duration-300 group
                hover:shadow-lg hover:scale-[1.02]"
            >
              <LogOut
                size={18}
                className="mr-3 text-[#b08562] group-hover:text-[#d9c6b0] transition-colors"
              />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default UserMenu;
