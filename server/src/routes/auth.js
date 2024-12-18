import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);

export default router; 