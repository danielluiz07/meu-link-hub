import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// Inicializa o Express e o Prisma
const app = express();
const prisma = new PrismaClient();

// Configurações (Middlewares)
app.use(cors()); 
app.use(express.json()); 


// ----- ROTAS DA API -----
app.get('/api/test', (req, res) => {
  res.json({ message: 'Ei! A API do Link Hub está funcionando!' });
});

// Rota para LER (Read) todos os links
app.get('/api/links', async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' } 
    });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar links.' });
  }
});

// Rota para CRIAR 
app.post('/api/links', async (req, res) => {
  try {
    const { title, url, description } = req.body; 
    const newLink = await prisma.link.create({
      data: {
        title,
        url,
        description,
      },
    });
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar link.' });
  }
});

// Rota para DELETAR 
app.delete('/api/links/:id', async (req, res) => {
  try {
    const { id } = req.params; // Pega o ID da URL
    await prisma.link.delete({
      where: { id },
    });
    res.status(200).json({ message: 'Link deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar link.' });
  }
});


// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Test A API em: http://localhost:3000/api/test');
});