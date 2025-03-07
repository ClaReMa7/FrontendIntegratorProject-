import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Configuración base para notificaciones de éxito
export const successToast = (message) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,

    className: 'bg-[#d9c6b0] text-[#3e0b05] border-l-4 border-l-[#b08562] shadow-md rounded',
    progressClassName: 'bg-[#3e0b05]'
  });
};

// Configuración base para notificaciones de error
export const errorToast = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,

    className: 'bg-[#3e0b05] text-[#d9c6b0] border-l-4 border-l-[#730f06] shadow-md rounded',
    progressClassName: 'bg-[#730f06]'
  });
};
