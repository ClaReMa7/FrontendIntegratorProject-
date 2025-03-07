import { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    document: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    repeatPassword: "",
    locality: ""
  });

  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://clavecompas-production.up.railway.app/clavecompas";

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const validateForm = () => {
    let newErrors = {};
    
    // Validaciones básicas de campos requeridos
    if (!formData.firstName) newErrors.firstName = "El nombre es obligatorio";
    if (!formData.lastName) newErrors.lastName = "El apellido es obligatorio";
    if (!formData.document) newErrors.document = "El documento es obligatorio";
    if (!formData.phone) newErrors.phone = "El teléfono es obligatorio";
    if (!formData.address) newErrors.address = "La dirección es obligatoria";
    if (!formData.locality) newErrors.locality = "La localidad es obligatoria";
    if (!isChecked) newErrors.terms = "Debe aceptar los términos y condiciones";

    // Validación de email
    if (!formData.email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo no es válido";
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener letras y números";
    }

    // Validación de repetir contraseña
    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Preparar los datos exactamente como espera la API
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        document: formData.document,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        password: formData.password,
        locality: formData.locality
      };

      console.log("Enviando datos:", requestData);

      // Realizar la petición con Axios
      const response = await axios.post(`${API_URL}/users/register`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Respuesta:", response.data);
      
      // Si llegamos aquí, el registro fue exitoso
      alert("Registro exitoso");
      
      // Limpiar el formulario
      setFormData({
        firstName: "",
        lastName: "",
        document: "",
        phone: "",
        address: "",
        email: "",
        password: "",
        repeatPassword: "",
        locality: ""
      });
      setIsChecked(false);
      
    } catch (error) {
      // Manejo de errores detallado
      console.error("Error completo:", error);
      
      let errorMessage = "Error en el registro";
      
      if (error.response) {
        // La solicitud fue realizada y el servidor respondió con un código de estado
        console.error("Respuesta de error:", error.response.data);
        console.error("Estado:", error.response.status);
        
        // Intentar obtener un mensaje de error específico
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Error ${error.response.status}: Parámetros no válidos`;
        }
        
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        console.error("No se recibió respuesta del servidor");
        errorMessage = "No se pudo conectar con el servidor. Verifique su conexión.";
      } else {
        // Algo ocurrió en la configuración de la solicitud que provocó un error
        console.error("Error de configuración:", error.message);
        errorMessage = "Error al preparar la solicitud";
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-[#3e0b05] shadow-lg rounded-3xl p-8 w-full max-w-3xl">
        <h1 className="text-center text-white text-2xl font-bold mt-6">
          Crear Cuenta
        </h1>
        <h6 className="text-center text-white text-sm mb-12">
          Completa los campos para continuar
        </h6>
        
        <form onSubmit={handleSubmit}>
          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="flex flex-col space-y-6 items-center">
              <div className="w-60">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              <div className="w-60">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              <div className="w-60">
                <input
                  type="text"
                  name="document"
                  placeholder="Documento"
                  value={formData.document}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {errors.document && (
                  <p className="text-red-500 text-xs mt-1">{errors.document}</p>
                )}
              </div>

              <div className="w-60">
                <input
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              <div className="w-60">
                <input
                  type="text"
                  name="locality"
                  placeholder="Localidad"
                  value={formData.locality}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {errors.locality && (
                  <p className="text-red-500 text-xs mt-1">{errors.locality}</p>
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="flex flex-col space-y-6 items-center">
              <div className="w-60">
                <input
                  type="email"
                  name="email"
                  placeholder="Correo"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="w-60">
                <input
                  type="text"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="w-60">
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="w-60">
                <input
                  type="password"
                  name="repeatPassword"
                  placeholder="Repetir contraseña"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                {errors.repeatPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.repeatPassword}</p>
                )}
              </div>

              {/* Checkbox */}
              <div className="flex items-start w-60">
                <input
                  type="checkbox"
                  name="terms"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 bg-[#3e0b05] accent-[#730f06] border-2 border-gray-500 rounded-xl cursor-pointer mr-3 mt-1"
                />
                <label className="text-white text-xs">
                  He leído y acepto los{" "}
                  <a href="#" className="text-gray-400 hover:underline">
                    Términos de Servicio
                  </a>{" "}
                  y la{" "}
                  <a href="#" className="text-gray-400 hover:underline">
                    Política de Privacidad
                  </a>{" "}
                  del sitio.
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-xs">{errors.terms}</p>
              )}
            </div>
          </div>

          {/* Botón Registrarme */}
          <div className="mt-12 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-[#730f06] text-white font-semibold px-20 py-2 rounded-xl hover:bg-[#5c0c05] transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Procesando..." : "Registrarme"}
            </button>
          </div>

          {/* Enlace de Iniciar sesión */}
          <div className="mt-3 mb-6 text-center">
            <p className="text-white text-xs">
              ¿Ya tienes una cuenta?{" "}
              <a href="/login" className="text-[#b08562] font-bold hover:underline">
                Inicia sesión aquí.
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;