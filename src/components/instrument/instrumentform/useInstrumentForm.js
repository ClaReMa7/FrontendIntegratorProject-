import { useState, useEffect } from "react";
import { useInstrumentContext } from "../../../context";
import instrumentService from "../../../services/instrumentService";
import cloudinaryService from "../../../services/images/cloudinaryService";
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

  // Load categories on component mount
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
  }, []);

  // Load instrument data when in edit mode
  useEffect(() => {
    if (isEditMode && instrumentToEdit) {
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
      }
    }
  }, [isEditMode, instrumentToEdit]);

  // Cleanup on modal close
  useEffect(() => {
    if (!isOpen) {
      // Release object URLs to prevent memory leaks
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    } else if (!isEditMode) {
      resetForm();
    }
  }, [isOpen, isEditMode, imagePreviews]);

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

  // Image handling
  const handleImageUpload = (e) => {
    if (isEditMode) return;

    const files = Array.from(e.target.files || []);
    const totalImages = imageFiles.length + existingImages.length;

    if (files.length && totalImages < 5) {
      const newFiles = files.slice(0, 5 - totalImages);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setImageFiles((prev) => [...prev, ...newFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    if (isEditMode) return;

    const isExistingImage = index < existingImages.length;
    
    if (isExistingImage) {
      const imageUrl = existingImages[index];
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => prev.filter((url) => url !== imageUrl));
    } else {
      const newIndex = index - existingImages.length;
      
      if (imagePreviews[index] && imagePreviews[index].startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviews[index]);
      }

      setImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Form reset
  const resetForm = () => {
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Form submission
  const handleSubmit = async (e) => {
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
        // Verify images in creation mode
        if (imageFiles.length === 0) {
          errorToast("Debes agregar al menos una imagen.");
          return;
        }

        // Upload images to Cloudinary
        const imageUrls = await Promise.all(
          imageFiles.map((file) => cloudinaryService.uploadImage(file))
        );

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
  };

  return {
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
  };
};