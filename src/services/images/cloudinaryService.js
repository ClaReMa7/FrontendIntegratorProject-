import axios from 'axios';


const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET =import.meta.env.VITE_API_UPLOAD_PRESET;

const cloudinaryService = {
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(CLOUDINARY_URL, formData);
            return response.data.secure_url;
        } catch (error) {
            alert('Error al subir imagen a Cloudinary');
            console.error('Error al subir imagen a Cloudinary:', error);
            throw error;
        }
}
};

export default cloudinaryService;
