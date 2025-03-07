import PropTypes from "prop-types";
import CategorySelector from "../instrumentform/CategorySelector";

/**
 * FormFields component - Manages rendering of instrument form input fields
 * 
 * Single Responsibility: Display form fields based on mode (edit/create)
 * and handle their values through provided callbacks
 */
const FormFields = ({ formData, categories, isEditMode, handleInputChange }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled={isEditMode}
          isEditMode={isEditMode}
        />

        <FormField
          label="Marca"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          required
          disabled={isEditMode}
          isEditMode={isEditMode}
        />

        <FormField
          label="Modelo"
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          required
          disabled={isEditMode}
          isEditMode={isEditMode}
        />

        <FormField
          label="Año"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleInputChange}
          min="1900"
          max={new Date().getFullYear()}
          required
          disabled={isEditMode}
          isEditMode={isEditMode}
        />

        <FormField
          label="Stock"
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleInputChange}
          required
          disabled={isEditMode}
          isEditMode={isEditMode}
        />

        <CategorySelector
          idCategory={formData.idCategory}
          categories={categories}
          onChange={handleInputChange}
          isEditMode={isEditMode}
          required
        />

        <FormField
          label="Precio"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleInputChange}
          required
          disabled={isEditMode}
          isEditMode={isEditMode}
        />

        <div>
          <label className="block text-[#730f06] font-medium mb-2">
            Disponible
          </label>
          <select
            name="available"
            value={formData.available.toString()}
            onChange={handleInputChange}
            required
            disabled={isEditMode}
            className={`select-category ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-[#730f06] font-medium mb-2">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={4}
          disabled={isEditMode}
          className={`select-category ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        ></textarea>
      </div>
    </div>
  );
};

// Reusable input field component
const FormField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  required, 
  disabled, 
  isEditMode,
  ...props 
}) => {
  return (
    <div>
      <label className="block text-[#730f06] font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`select-category ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        {...props}
      />
    </div>
  );
};

FormFields.propTypes = {
  formData: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  isEditMode: PropTypes.bool,
};

export default FormFields;