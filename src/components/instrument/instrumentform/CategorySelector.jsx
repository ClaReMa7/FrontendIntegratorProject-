import PropTypes from "prop-types";

/**
 * CategorySelector component - Specialized component for category selection
 * 
 * Single Responsibility: Manages the category dropdown and its state
 */
const CategorySelector = ({ 
  idCategory, 
  categories, 
  onChange, 
  isEditMode, 
  required = true 
}) => {
  return (
    <div>
      <label className="block text-[#730f06] font-medium mb-2">
        Categoría
      </label>
      <select
        name="idCategory"
        value={idCategory}
        onChange={onChange}
        required={required}
        className="select-category"
      >
        <option value="">Selecciona una categoría</option>
        {categories.map((category) => (
          <option
            key={category.idCategory || category.id}
            value={category.idCategory}
          >
            {category.name}
          </option>
        ))}
      </select>
      {isEditMode && (
        <p className="mt-1 text-sm text-[#730f06]">
          Solo puedes editar la categoría del instrumento.
        </p>
      )}
    </div>
  );
};

CategorySelector.propTypes = {
  idCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  categories: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  required: PropTypes.bool
};

export default CategorySelector;