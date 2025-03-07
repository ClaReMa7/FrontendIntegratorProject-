import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import usersService from "../../services/usersService";
import "../../styles/Modal.css";
import { successToast, errorToast } from "../../utils/toastNotifications";

export const AssignRolesModal = ({ isOpen, onClose, userRoles, allRoles = [], idUser }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Sincroniza los roles seleccionados cuando el modal se abre o cambian los roles del usuario
  useEffect(() => {
    if (isOpen) {
      setSelectedRoles(userRoles.map((r) => r.id)); // Guardamos solo los IDs
    }
  }, [isOpen, userRoles]);

  // Maneja el cambio de selección de roles
  const handleRoleChange = (roleId) => {
    setSelectedRoles((prevRoles) =>
      prevRoles.includes(roleId)
        ? prevRoles.filter((id) => id !== roleId)
        : [...prevRoles, roleId]
    );
  };

  // Envía los roles seleccionados al backend
  const assignRoles = async () => {
    try {
      console.log("Enviando roles:", selectedRoles);
      const token = localStorage.getItem("token");
      const data = await usersService.assignRoles(idUser, selectedRoles, token);
      console.log("Respuesta del servidor:", data);

      successToast("Roles actualizados correctamente");
      onClose();
    } catch (error) {
      console.error("Error al asignar roles:", error);
      errorToast("Error al asignar roles");
    }
  };

  const handleConfirm = () => {
    assignRoles();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1e1e1e]/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold text-[#730f06]">Seleccionar Roles</h2>
          <button onClick={onClose} className="text-[#730f06] hover:text-[#d9c6b0]">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto scrollbar-form">
          {allRoles.map((role) => (
            <label key={role.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRoles.includes(role.id)}
                onChange={() => handleRoleChange(role.id)}
                className="form-checkbox text-[#730f06]"
              />
              <span className="text-[#1e1e1e]">{role.name}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border-2 border-[#730f06] text-[#730f06] rounded-lg hover:text-[#d9c6b0] hover:bg-[#730f06]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 bg-[#730f06] text-[#d9c6b0] rounded-lg hover:bg-[#b08562]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

AssignRolesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userRoles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  allRoles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  idUser: PropTypes.number.isRequired,
};
