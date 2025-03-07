import { useState } from "react";
import PropTypes from "prop-types";
import { Plus, Trash2, Loader2 } from "lucide-react";
import cloudinaryService from "../../../services/images/cloudinaryService";

/**
 * ImageUploader component - Handles image preview and uploading UI
 * 
 * Single Responsibility: Manages image upload interface and previews
 */
const ImageUploader = ({ 
  isEditMode, 
  imagePreviews, 
  removeImage, 
  setImagePreviews, 
  setImageData, 
  setImageFiles = null
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // Manejador mejorado para subir imágenes usando el backend
  const handleImageUpload = async (e) => {
    if (isEditMode) return;

    const files = Array.from(e.target.files || []);
    const totalImages = imagePreviews.length;

    // Validar número máximo de imágenes
    if (files.length + totalImages > 5) {
      alert('Máximo 5 imágenes permitidas');
      return;
    }

    // Validar tipos de archivo
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert('Solo se permiten archivos de imagen');
      return;
    }

    setIsUploading(true);

    try {
      // Para compatibilidad con el código anterior
      if (setImageFiles) {
        setImageFiles(prev => [...prev, ...validFiles]);
      }

      for (const file of validFiles) {
        // Subir a través del backend de Spring Boot
        const response = await cloudinaryService.uploadImageViaBackend(file);
        
        // Actualizar previsualizaciones
        setImagePreviews(prev => [...prev, response.secureUrl]);
        
        // Si tenemos setImageData, almacenar datos completos de la imagen
        if (setImageData) {
          setImageData(prev => [...prev, {
            url: response.secureUrl,
            publicId: response.publicId,
            width: response.width,
            height: response.height,
            format: response.format
          }]);
        }
      }
    } catch (error) {
      console.error('Error en la carga de imágenes:', error);
      alert('Error al subir imagen');
    } finally {
      setIsUploading(false);
    }
  };

  // En modo edición, solo mostrar las imágenes existentes
  if (isEditMode) {
    return (
      <div>
        <label className="block text-[#3e0b05] font-medium mb-2">
          Imágenes
        </label>
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg opacity-80"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // En modo creación, permitir carga de imágenes
  return (
    <div>
      <label className="block text-[#3e0b05] font-medium mb-2">
        Imágenes (máximo 5)
      </label>
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          {imagePreviews.length < 5 && (
            <label className={`aspect-square flex items-center justify-center border-2 border-[#757575] border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}>
              <div className="flex flex-col items-center justify-center">
                {isUploading ? (
                  <>
                    <Loader2 className="text-[#b08562] mb-1 animate-spin" size={24} />
                    <span className="text-xs text-[#757575]">Subiendo...</span>
                  </>
                ) : (
                  <>
                    <Plus className="text-[#b08562] mb-1" size={24} />
                    <span className="text-xs text-[#757575]">Añadir</span>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={isUploading}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

ImageUploader.propTypes = {
  isEditMode: PropTypes.bool.isRequired,
  imagePreviews: PropTypes.array.isRequired,
  removeImage: PropTypes.func.isRequired,
  setImagePreviews: PropTypes.func.isRequired,
  setImageData: PropTypes.func,
  setImageFiles: PropTypes.func
};

export default ImageUploader;