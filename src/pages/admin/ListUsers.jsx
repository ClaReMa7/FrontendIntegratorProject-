import { useState, useEffect } from "react";
import usersService from "../../services/usersService";
import PaginationComponent from "../../components/common/PaginationComponent";
import "../../styles/ListProduct.css";
import { Trash2, Edit, ShieldCheck } from "lucide-react";
import { successToast, errorToast } from "../../utils/toastNotifications";
import { AssignRolesModal } from "../../components/user/AssignRolesModal";

export const ListUsers = () => {
    const [users, setAllUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [userId,setUserId] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAssignRolesOpen, setIsAssignRolesOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Obtener usuarios paginados
    const fetchUsers = async (uiPage) => {
        const apiPage = uiPage - 1;
        console.log(`Solicitando página ${apiPage} a la API`);
        const token = localStorage.getItem("token");
        const data = await usersService.getUsers(apiPage, 10, token);
        console.log("Respuesta procesada:", data);
        
        setAllUsers(data.users);
        setTotalPages(data.totalPages);

        if (data.currentPageIndex !== undefined) {
            const uiPageFromApi = data.currentPageIndex + 1;
            if (uiPageFromApi !== currentPage) {
                setCurrentPage(uiPageFromApi);
            }
        }
    };

    // Obtener lista de roles
    const fetchRoles = async () => {
        console.log("Solicitando roles...");
        const token = localStorage.getItem("token");
        const data = await usersService.getRoles(token);
        console.log("Roles recibidos:", data);
        setRoles(data.response);
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    // Obtener detalle del usuario por ID antes de abrir el modal
    const fetchUserDetails = async (userId) => {
        console.log(`Obteniendo detalles del usuario con ID: ${userId}`);
        const token = localStorage.getItem("token");
        try {
            const userDetails = await usersService.getUserById(userId, token);
            console.log("Detalles del usuario recibidos:", userDetails);
            setSelectedRoles(userDetails.response.roles); // Guardamos el detalle del usuario
            setUserId(userId);
            setIsAssignRolesOpen(true);
        } catch (error) {
            console.error("Error al obtener detalles del usuario:", error);
            errorToast("No se pudo obtener la información del usuario.");
        }
    };

    // Función para asignar roles (obtiene detalles antes de abrir el modal)
    const handleAssignRoles = (user) => {
        console.log("Usuario seleccionado para asignar roles:", user);
        fetchUserDetails(user.id); // Obtener detalles antes de abrir el modal
    };

    // Cerrar modal de asignación de roles
    const handleCloseAssignRolesModal = () => {
        setIsAssignRolesOpen(false);
        setSelectedUser(null);
        fetchUsers(currentPage);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[#d9c6b0] to-[#f1eae7]">
                <h2 className="text-2xl font-bold text-[#3e0b05] mb-4">Usuarios del Sistema</h2>
                <p className="text-[#1e1e1e] mb-4">Todos los usuarios</p>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#3e0b05] text-white">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Email</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d9c6b0]">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#f1eae7] transition-colors">
                                        <td className="p-3 text-[#1e1e1e]">{user.id}</td>
                                        <td className="p-3 font-medium text-[#3e0b05]">{user.firstName}</td>
                                        <td className="p-3 font-medium text-[#3e0b05]">{user.email}</td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    className="flex items-center justify-center text-white bg-[#730f06] hover:bg-[#3e0b05] p-2 rounded-md transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                
                                                <button 
                                                    onClick={() => handleAssignRoles(user)}
                                                    className="flex items-center justify-center text-[#1e1e1e] bg-[#f1eae7] hover:bg-[#d9c6b0] p-2 rounded-md transition-colors"
                                                    title="Configurar Roles"
                                                >
                                                    <ShieldCheck size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-6 text-center text-[#757575]">
                                        No hay usuarios disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Modal para asignar roles */}
            <AssignRolesModal
                isOpen={isAssignRolesOpen}
                onClose={handleCloseAssignRolesModal}
                userRoles={selectedRoles}
                allRoles={roles}
                idUser={userId}
            />
        </div>
    );
};

export default ListUsers;
