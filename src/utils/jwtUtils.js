import jwt from 'jsonwebtoken';

export const jwtUtils = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn: "5h"
    }, (err, token) => {
      if (err) {
        reject({ success: false, message: err });
      } else {
        resolve(token);
      }
    });
  });
};

// Verificación de token
export const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRETORPRIVATEKEY, (err, decoded) => {
      if (err) {
        reject({ success: false, message: 'Token no válido' });
      } else {
        resolve(decoded);
      }
    });
  });
};
