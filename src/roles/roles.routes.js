
import { Router } from 'express';
import { createRole } from './roles.controller.js';
import { roleMiddleware } from './roles.controller.js';  

const router = Router();

// Ruta para crear roles (solo accesible por admins)
router.post('/addRole', roleMiddleware(['admin']), createRole);

export default router;
