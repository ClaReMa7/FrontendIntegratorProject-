import axios from "axios";
//const API_LOCAL = import.meta.env.VITE_API_URL_LOCAL;
const API_URL = import.meta.env.VITE_API_URL;

const usersService = {
  
  async getRoles(token) {
    console.log(token)
    try {
      const response = await axios.get(`${API_URL}/roluser`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregamos el token Bearer
          },
        }
      );
      console.log("vemos si trae algo ",response);
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener roles:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getUserById(idUser,token) {
    
    try {
      const response = await axios.get(`${API_URL}/users/${idUser}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregamos el token Bearer
          },
        }
      );
      console.log("vemos si trae algo ",response);
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener roles:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

 
  async getUsers(page = 0, pageSize = 10, token) {
    try {
      // La API usa paginación base 0 (como es común en Spring Boot)
      const response = await axios.get(`${API_URL}/users`, {
        params: {
          page, // Enviamos directamente el valor (que ya debe estar en base 0)
          pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`, // Agregamos el token Bearer
        },
        
      });
      
      console.log("Respuesta completa del backend:", response.data);
      
      // Asegurándonos de acceder correctamente a la estructura de la respuesta
      const data = response.data?.response || {};
      
      return {
        users: data.content || [],
        totalPages: data.totalPages || 1,
        currentPageIndex: data.number || 0, // Página actual en base 0
      };
    } catch (error) {
      console.error(
        "Error al listar los usuarios:",
        error.response?.data || error.message
      );
      return { users: [], totalPages: 1, currentPageIndex: 0 };
    }
  },

// Método actualizado para solo actualizar la categoría

async assignRoles(id,assignRoles,token) {
  try {
    // Obtenemos el ID del instrumento y la categoría
    const idUser = id;
    const idsRol = assignRoles;
        
    // Realizamos la petición PUT al endpoint correcto
    const response = await axios.put(
      `${API_URL}/roluser/assignRoles`,
      {
        idUser: idUser,
        idsRol: idsRol
      }, // No necesitamos enviar un cuerpo si el ID de categoría ya está en la URL
      {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agregamos el token Bearer
        },
      }
    );
    
    console.log("Respuesta de actualización de roles:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error al actualizar los roles del usuario:",
      error.response?.data || error.message
    );
    throw error;
  }
},
};

export default usersService;
