import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT as string, 10) || 8000;

app.listen(PORT, HOST, () => {
  console.log(`🚀 ~ Server is running on http://${HOST}:${PORT}`);
});