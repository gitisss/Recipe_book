import express from 'express';   

export const checkLogin = (req: express.Request, res: express.Response): void => {
    try {
        if (!req.body || !req.body.username || !req.body.password) {
            res.status(400).json({ error: 'Invalid input' });
            return;
        }

        // Simulate login logic
        const { username, password } = req.body;
        if (username === 'admin' && password === 'password') {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};