import express from 'express';
import { connectToWhatsApp } from './whatsapp';
import router from './routes';

const PORT = process.env.PORT ?? 3000;

const app = express();
app.use(express.json());
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

connectToWhatsApp().catch(console.error);