import PropTypes from "prop-types";
import { X } from "lucide-react";
import { useInstrumentForm } from "./useInstrumentForm";
import FormFields from "./FormFields";
import ImageUploader from "./ImageUploader";
import "../../../styles/Modal.css";

/**
 * InstrumentForm component - Handles creation and editing of instruments
 * 
 * Single Responsibility: Manages the overall form UI structure and orchestrates
 * the form submission process
 */
export const InstrumentForm = ({ isOpen, onClose, instrumentToEdit = null }) => {
  const {
    formData,
    categories,
    imagePreviews,
    isEditMode,
    handleInputChange,
    handleSubmit,
    handleImageUpload,
    removeImage,
    resetForm,
    handleClose
  } = useInstrumentForm({ isOpen, onClose, instrumentToEdit });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1e1e1e]/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#b08562] p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-[#730f06] text-xl font-semibold">
            {isEditMode ? "Editar Categoría del Instrumento" : "Registrar Instrumento"}
          </h2>
          <button
            onClick={handleClose}
            className="text-[#730f06] hover:text-[#d9c6b0] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="p-6 space-y-6 verflow-y-auto max-h-[500px] scrollbar-form"
          onSubmit={handleSubmit}
        >
          <FormFields 
            formData={formData}
            categories={categories}
            isEditMode={isEditMode}
            handleInputChange={handleInputChange}
          />

          <ImageUploader 
            isEditMode={isEditMode}
            imagePreviews={imagePreviews}
            removeImage={removeImage}
            handleImageUpload={handleImageUpload}
          />

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border-2 border-[#730f06] text-[#730f06] rounded-lg text-[#1e1e1e] hover:text-[#d9c6b0] hover:bg-[#730f06]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#730f06] text-[#d9c6b0] rounded-lg hover:bg-[#b08562] transition-colors"
            >
              {isEditMode ? "Actualizar Categoría" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

InstrumentForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  instrumentToEdit: PropTypes.object,
};