import { Schema, model } from "mongoose";

// Definición del esquema de reservación
const reservationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Usuario es requerido"]
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Habitación es requerida"]
    },
    checkInDate: {
      type: Date,
      required: [true, "Fecha de check-in es requerida"],
      validate: {
        validator: function(value) {
          return value >= Date.now(); // Asegura que la fecha de entrada sea hoy o futura
        },
        message: "La fecha de check-in no puede ser anterior a hoy"
      }
    },
    checkOutDate: {
      type: Date,
      required: [true, "Fecha de check-out es requerida"],
      validate: {
        validator: function(value) {
          return value > this.checkInDate; // Asegura que la fecha de salida sea posterior al check-in
        },
        message: "La fecha de check-out debe ser posterior a la de check-in"
      }
    },
    totalPrice: {
      type: Number,
      required: [true, "El precio total es requerido"],
      min: [0, "El precio total no puede ser menor a 0"]
    },
    guests: {
      type: Number,
      required: [true, "El número de huéspedes es requerido"],
      min: [1, "Debe haber al menos un huésped"]
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending"
    }
  },
  {
    timestamps: true, 
    versionKey: false 
  }
);

export default model("Reservation", reservationSchema);
