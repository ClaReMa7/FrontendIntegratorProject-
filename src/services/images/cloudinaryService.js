import axios from 'axios';

// Variables de entorno para configuración directa con Cloudinary
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_API_UPLOAD_PRESET;

// URL del backend de Spring Boot (ajustar según configuración)
const BACKEND_URL = import.meta.env.VITE_API_URL;

const cloudinaryService = {
    /**
     * Sube una imagen directamente a Cloudinary usando upload_preset
     * @param {File} file - Archivo de imagen a subir
     * @returns {Promise<string>} URL segura de la imagen subida
     */
    async uploadImageDirect(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        try {
            const response = await axios.post(CLOUDINARY_URL, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error al subir imagen a Cloudinary:', error);
            throw error;
        }
    },

    /**
     * Sube una imagen a través del backend de Spring Boot
     * @param {File} file - Archivo de imagen a subir
     * @returns {Promise<Object>} Datos completos de la imagen subida
     */
    async uploadImageViaBackend(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await axios.post(`${BACKEND_URL}/api/cloudinary/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al subir imagen vía backend:', error);
            throw error;
        }
    },

    /**
     * Elimina una imagen a través del backend
     * @param {string} publicId - ID público de la imagen en Cloudinary
     * @returns {Promise<Object>} Resultado de la eliminación
     */
    async deleteImage(publicId) {
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/cloudinary/delete/${publicId}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            throw error;
        }
    }
};

export default cloudinaryService;