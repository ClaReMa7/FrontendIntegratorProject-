import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, X } from "lucide-react";
import { useAuth } from "../../context";

import { errorToast, successToast } from "../../utils/toastNotifications";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  // Estados
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setEmailError("");
    setPasswordError("");
    setError("");
    setShowPassword(false);
    setRememberMe(false);
  };

  // Función mejorada para cerrar el modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Validaciones
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("El email es requerido");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Email inválido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (!password.trim()) {
      setPasswordError("La contraseña es requerida");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Manejadores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validación en tiempo real
    if (name === "email") {
      validateEmail(value);
    } else if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error general
    // Validar campos
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);

    if (!isEmailValid || !isPasswordValid) {
      errorToast("Por favor, completa todos los campos"); // Mostrar errorToast aquí
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        successToast("¡Bienvenido!");
        setFormData({ email: "", password: "" });
        setError(""); // Limpiar error general
        onClose();
      } else {
        if (result.error.toLowerCase().includes("email")) {
          setEmailError(result.error);
        } else if (result.error.toLowerCase().includes("contraseña")) {
          setPasswordError(result.error);
        } else {
          setError(
            "Campos inválidos. Por favor, verifica tu email y contraseña."
          );
          setFormData({
            email: "",
            password: "",
          });
        }
        errorToast(result.error); // Mostrar errorToast aquí
      }
    } catch (error) {
      errorToast("Error al intentar iniciar sesión");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md transform transition-all duration-300 ease-out hover:-translate-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div
            className="relative bg-gradient-to-br from-[#3e0b05] to-[#2a0803] rounded-3xl 
           shadow-[0_10px_40px_rgba(0,0,0,0.6)] 
           backdrop-blur-sm 
           p-8
           space-y-7
           transition-all 
           duration-300 
           hover:shadow-[0_15px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Botón Cerrar Mejorado */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[#757575] hover:text-[#d9c6b0] transition-colors p-1.5 rounded-full hover:bg-white/5"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>

            {/* Encabezado Mejorado */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-[#d9c6b0] tracking-tight">
                Bienvenido de nuevo a Clave & Compas
              </h1>
              <p className="text-[#9e9e9e] text-base mt-1">
                Inicia sesión para continuar
              </p>
            </div>

            {/* Formulario Mejorado */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="text-red-500 text-sm text-center mb-4">
                  {error}
                </div>
              )}
              {/* Campo Email */}
              <div className="group">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 transition-colors group-hover:text-amber-700" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#2a0803] text-[#d9c6b0] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors"
                    placeholder="Email"
                  />

                  {emailError && (
                    <span className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
                      {emailError}
                    </span>
                  )}
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="group">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5 transition-colors group-hover:text-amber-700" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#2a0803] text-[#d9c6b0] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-700 transition-colors"
                    placeholder="Contraseña"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {passwordError && (
                    <span className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">
                      {passwordError}
                    </span>
                  )}
                </div>
              </div>

              {/* Recordarme y Contraseña Olvidada - Mejorados */}
              <div className="flex items-center justify-between text-sm pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#757575] rounded-md peer-checked:bg-[#730f06] peer-checked:border-[#730f06] transition-all duration-200"></div>
                    <div className="absolute top-[3px] left-[5px] text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#9e9e9e] group-hover:text-[#b08562] transition-colors duration-200">
                    Recordarme
                  </span>
                </label>
                <a
                  href="#"
                  className="text-[#b08562] hover:text-[#d9c6b0] transition-colors duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón Enviar Mejorado */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#730f06] to-[#3e0b05] text-[#d9c6b0] py-3.5 rounded-xl 
                  font-medium shadow-lg hover:shadow-xl hover:from-[#3e0b05] hover:to-[#730f06] 
                  transform hover:scale-[1.02] transition-all duration-300 text-base mt-4
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!emailError || !!passwordError}
              >
                Iniciar Sesión
              </button>

              {/* Enlace Registrarse Mejorado */}
              <p className="text-center text-[#9e9e9e] text-sm pt-2">
                ¿No tienes una cuenta?{" "}
                <a
                  href="#"
                  className="text-[#b08562] hover:text-[#d9c6b0] transition-colors duration-200 font-medium"
                >
                  Regístrate
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
