const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// router.post('/signup', authController.Signup);
router.post('/login',  async (req, res) => {
    try{
        const { username, password } = req.body;
        const query = `SELECT * FROM public.users where username = $1`;
        const result = await db.query(query, [username]);
       
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        
        const IsPasswordValid = await bcrypt.compare(password, user.password);
    
        if(!IsPasswordValid){
            return res.status(404).json({message: 'Invalid credentials'});
        }
        const token = await jwt.sign({ userId: user.id, userName: user.username }, process.env.SECRET_KEY || "secretKey", {
            expiresIn: '23h',
        });
        
        res.status(200).json({ message: 'Login successful', token });
    
       } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;