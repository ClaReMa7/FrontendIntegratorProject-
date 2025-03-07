import { useState, useEffect, useCallback } from "react";
import { useInstrumentContext } from "../../../context";
import instrumentService from "../../../services/instrumentService";
import { successToast, errorToast } from "../../../utils/toastNotifications";

/**
 * Custom hook to manage instrument form state and logic
 * 
 * Follows Single Responsibility Principle: Handles only form state management
 * and form submission logic, separate from UI rendering
 */
export const useInstrumentForm = ({ isOpen, onClose, instrumentToEdit }) => {
  const { addInstrument, updateInstrument } = useInstrumentContext();
  const isEditMode = !!instrumentToEdit;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    stock: "",
    description: "",
    price: "",
    available: false,
    idCategory: "",
    imageUrls: [],
  });

  const [categories, setCategories] = useState([]);
  
  // Image state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imageData, setImageData] = useState([]); // Nuevo estado para datos completos de imágenes
  const [initialLoad, setInitialLoad] = useState(true); // Flag para controlar la carga inicial

  // Load categories on component mount - solo una vez
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await instrumentService.getCategories();
        if (data?.response?.categories && Array.isArray(data.response.categories)) {
          setCategories(data.response.categories);
        } else {
          console.error("La API no devolvió un array:", data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []); // Sin dependencias, se ejecuta solo al montar

  // Load instrument data when in edit mode - solo cuando cambia instrumentToEdit o isEditMode
  useEffect(() => {
    if (isEditMode && instrumentToEdit && initialLoad) {
      setFormData({
        id: instrumentToEdit.id || instrumentToEdit.idProduct,
        name: instrumentToEdit.name || "",
        brand: instrumentToEdit.brand || "",
        model: instrumentToEdit.model || "",
        year: instrumentToEdit.year || "",
        stock: instrumentToEdit.stock || "",
        description: instrumentToEdit.description || "",
        price: instrumentToEdit.price || "",
        available: instrumentToEdit.available || false,
        idCategory: instrumentToEdit.idCategory || "",
        imageUrls: [],
      });

      if (instrumentToEdit.imageUrls && instrumentToEdit.imageUrls.length > 0) {
        setExistingImages(instrumentToEdit.imageUrls);
        setImagePreviews(instrumentToEdit.imageUrls);
        // Inicializar imageData con las URLs existentes
        setImageData(instrumentToEdit.imageUrls.map(url => ({ url })));
      }
      
      // Marcar como ya cargado para evitar actualizaciones repetidas
      setInitialLoad(false);
    }
  }, [isEditMode, instrumentToEdit, initialLoad]);

  // Reset initialLoad cuando cambia isOpen
  useEffect(() => {
    if (isOpen) {
      setInitialLoad(true);
    }
  }, [isOpen]);

  // Cleanup on modal close
  useEffect(() => {
    if (!isOpen) {
      // Release object URLs to prevent memory leaks
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    } else if (!isEditMode && initialLoad) {
      resetForm();
      setInitialLoad(false);
    }
  }, [isOpen, isEditMode, imagePreviews, initialLoad]);

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // In edit mode, only allow category changes
    if (isEditMode && name !== "idCategory") {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "idCategory"
          ? Number(value)
          : name === "available"
          ? value === "true"
          : value,
    }));
  };

  // La función removeImage memoizada para evitar recreaciones en cada renderizado
  const removeImage = useCallback(async (index) => {
    if (isEditMode) return;

    try {
      // Actualizar la interfaz como antes
      const isExistingImage = index < existingImages.length;
      
      if (isExistingImage) {
        const imageUrl = existingImages[index];
        setExistingImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter(url => url !== imageUrl));
      } else {
        const newIndex = index - existingImages.length;
        
        if (imagePreviews[index] && imagePreviews[index].startsWith("blob:")) {
          URL.revokeObjectURL(imagePreviews[index]);
        }

        setImageFiles(prev => prev.filter((_, i) => i !== newIndex));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
      }

      // Actualizar imageData
      setImageData(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      errorToast("Error al eliminar la imagen");
    }
  }, [isEditMode, existingImages, imagePreviews]);

  // Form reset - memoizado
  const resetForm = useCallback(() => {
    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    setFormData({
      name: "",
      brand: "",
      model: "",
      year: "",
      stock: "",
      description: "",
      price: "",
      available: false,
      idCategory: "",
      imageUrls: [],
    });

    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setImageData([]);
  }, [imagePreviews]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Form submission - memoizado
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    try {
      if (!formData.idCategory) {
        errorToast("Debes seleccionar una categoría.");
        return;
      }

      if (isEditMode) {
        // In edit mode, only send ID and category
        const categoryUpdateData = {
          id: formData.id,
          idCategory: formData.idCategory
        };
        
        const updatedInstrument = await instrumentService.updateInstrument(categoryUpdateData);
        
        if (updateInstrument) {
          updateInstrument(updatedInstrument);
        }
        
        successToast("Categoría del instrumento actualizada con éxito.");
      } else {
        // Verificar imágenes - ahora usamos imageData en lugar de imageFiles
        if (imageData.length === 0 && imageFiles.length === 0) {
          errorToast("Debes agregar al menos una imagen.");
          return;
        }

        // Obtener URLs de imágenes (según método preferido)
        let imageUrls;
        
        if (imageData.length > 0) {
          // Si tenemos imageData, extraer las URLs
          imageUrls = imageData.map(img => img.url);
        } else {
          // Si no tenemos imageData pero sí imageFiles, usar el método antiguo
          errorToast("Las imágenes aún no se han subido correctamente.");
          return;
        }

        // Create instrument with image URLs
        const newInstrument = await instrumentService.createInstrument({
          ...formData,
          imageUrls,
        });

        if (addInstrument) {
          addInstrument(newInstrument);
        }
        
        successToast("Instrumento agregado con éxito.");
      }
      
      handleClose();
    } catch (error) {
      console.error("Error completo:", error);

      if (error.response?.status === 409) {
        errorToast("El instrumento ya existe. Intenta con otro nombre.");
      } else if (error.response?.status === 400) {
        errorToast("Datos inválidos. Revisa el formulario.");
      } else if (error.response?.status === 500) {
        errorToast("Error en el servidor. Inténtalo más tarde.");
      } else {
        errorToast(error.message || `Error al ${isEditMode ? 'actualizar la categoría' : 'crear'} el instrumento.`);
      }
    }
  }, [formData, isEditMode, imageData, imageFiles, addInstrument, updateInstrument, handleClose]);

  return {
    formData,
    categories,
    imagePreviews,
    imageData,
    isEditMode,
    handleInputChange,
    handleSubmit,
    removeImage,
    resetForm,
    handleClose,
    setImagePreviews,
    setImageData,
    setImageFiles
  };
};