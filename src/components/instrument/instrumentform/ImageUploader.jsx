import PropTypes from "prop-types";
import { Plus, Trash2 } from "lucide-react";

/**
 * ImageUploader component - Handles image preview and uploading UI
 * 
 * Single Responsibility: Manages image upload interface and previews
 */
const ImageUploader = ({ isEditMode, imagePreviews, removeImage, handleImageUpload }) => {
  // In edit mode, just show existing images
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

  // In create mode, allow image uploading
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
            <label className="aspect-square flex items-center justify-center border-2 border-[#757575] border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center">
                <Plus className="text-[#b08562] mb-1" size={24} />
                <span className="text-xs text-[#757575]">Añadir</span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
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
  handleImageUpload: PropTypes.func.isRequired,
};

export default ImageUploader;