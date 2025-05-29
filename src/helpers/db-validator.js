import User from '../users/user.model.js';
import Hotel from '../hotels/hotel.model.js';
import Room from '../rooms/room.model.js';
import Lounge from '../lounge/loungeModel.js';
import Event from '../events/event.model.js';
import Reservation from '../reservations/reservation.model.js';
import Resources from '../resources_Events/resourcesModel.js';
import Services from '../resources_Events/servicesModel.js';
import Facture from '../invoice/invoice.model.js';
import Role from '../roles/rolesModel.js';

// Validación para Usuario
export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);
    if(!existeUsuario){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para Hotel
export const existeHotelById = async (id = '') => {
    const existeHotel = await Hotel.findById(id);
    if(!existeHotel){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para Habitación
export const existeRoomById = async (id = '') => {
    const existeRoom = await Room.findById(id);
    if(!existeRoom){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para Salón
export const existeLoungeById = async (id = '') => {
    const existeLounge = await Lounge.findById(id);
    if(!existeLounge){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para Evento
export const existeEventById = async (id = '') => {
    const existeEvent = await Event.findById(id);
    if(!existeEvent){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para Reservación
export const existeReservationById = async (id = '') => {
    const existeReservation = await Reservation.findById(id);
    if(!existeReservation){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para Recursos
export const existeResourceById = async (id = '') => {
    const existeResource = await Resources.findById(id);
    if(!existeResource){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para Servicios
export const existeServiceById = async (id = '') => {
    const existeService = await Services.findById(id);
    if(!existeService){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para Factura
export const existeFactureById = async (id = '') => {
    const existeFacture = await Facture.findById(id);
    if(!existeFacture){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para Rol
export const existeRoleById = async (id = '') => {
    const existeRole = await Role.findById(id);
    if(!existeRole){
        throw new Error(`El ID ${id} no existe`);
    }
}

// Validación para verificar si un rol existe
export const esRoleValido = async (role = '') => {
    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El rol ${role} no está registrado en la base de datos`);
    }
}

// Validación para verificar si un email ya existe
export const emailExiste = async (email = '') => {
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}

// Validación para verificar si un username ya existe
export const usernameExiste = async (username = '') => {
    const existeUsername = await User.findOne({ username });
    if (existeUsername) {
        throw new Error(`El nombre de usuario ${username} ya está registrado`);
    }
}

// Validación para verificar si un número de habitación ya existe en un hotel
export const roomNumberExiste = async (roomNumber = '', hotelId = '') => {
    const existeRoomNumber = await Room.findOne({ roomNumber, hotel: hotelId });
    if (existeRoomNumber) {
        throw new Error(`El número de habitación ${roomNumber} ya existe en este hotel`);
    }
}

// Validación para verificar si un nombre de evento ya existe
export const eventNameExiste = async (nameEvent = '') => {
    const existeEventName = await Event.findOne({ nameEvent });
    if (existeEventName) {
        throw new Error(`El nombre de evento ${nameEvent} ya está registrado`);
    }
}

// Validación para verificar si un nombre de recurso ya existe
export const resourceNameExiste = async (nameResource = '') => {
    const existeResourceName = await Resources.findOne({ nameResource });
    if (existeResourceName) {
        throw new Error(`El nombre de recurso ${nameResource} ya está registrado`);
    }
}

// Validación para verificar si un nombre de servicio ya existe
export const serviceNameExiste = async (nameService = '') => {
    const existeServiceName = await Services.findOne({ nameService });
    if (existeServiceName) {
        throw new Error(`El nombre de servicio ${nameService} ya está registrado`);
    }
}

// Validación para verificar si un nombre de hotel ya existe
export const hotelNameExiste = async (nameHotel = '') => {
    const existeHotelName = await Hotel.findOne({ nameHotel });
    if (existeHotelName) {
        throw new Error(`El nombre de hotel ${nameHotel} ya está registrado`);
    }
}

// Validación para verificar si un nombre de salón ya existe
export const loungeNameExiste = async (name = '') => {
    const existeLoungeName = await Lounge.findOne({ name });
    if (existeLoungeName) {
        throw new Error(`El nombre de salón ${name} ya está registrado`);
    }
}