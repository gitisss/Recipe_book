import { useState } from 'react';
import axios from 'axios';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) : Promise<void> => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/logIn', {
        username,
        password
      });

      setMessage(`✅ ${response.data.message}`);
    } catch (error: any) {
      if (error.response) {
        setMessage(`❌ ${error.response.data.error}`);
      } else {
        setMessage('❌ שגיאה כללית');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '0 auto' }}>
      <h2>🔐 התחברות</h2>
      <input
        type="text"
        placeholder="שם משתמש"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">התחבר</button>
      <p>{message}</p>
    </form>
  );
};
