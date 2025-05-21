import { Request, Response } from 'express';
import { User } from '../models/UserModel';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
//   const username = req.body.username;
//   const password = req.body.password;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
