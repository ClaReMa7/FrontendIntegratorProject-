//import React from "react";
import { X, AlertTriangle } from "lucide-react";
import PropTypes from "prop-types";

const ConfirmationModal = ({ isOpen, onClose, onDelete, id }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1e1e1e]/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#d9c6b0] rounded-lg w-full max-w-md relative shadow-xl border border-[#b08562]/20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#730f06] hover:text-[#b08562] transition-colors"
        >
          <X size={24} />
        </button>

        {/* Modal content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#730f06]/10 p-2 rounded-full">
              <AlertTriangle size={24} className="text-[#730f06]" />
            </div>
            <h2 className="text-[#1e1e1e] text-xl font-semibold">
              Confirmar eliminación de instrumento
            </h2>
          </div>

          <p className="text-[#757575] mb-6">
            ¿Estás seguro que deseas eliminar este instrumento? Esta acción no
            se puede deshacer.
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-[#b08562] text-white hover:bg-[#757575] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onDelete(id);
                onClose();
              }}
              className="px-4 py-2 rounded-md bg-[#730f06] text-white hover:bg-[#b08562] transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmationModal;
