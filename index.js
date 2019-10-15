const express = require('express');

//Startando o server e habilitando JSON para comunicação
const server = express();
server.use(express.json());

const projects = [];

//Contador do middleware que registra quantidade de requisições feitas a API
let totalReq = 0;

//Middleware para contar numero de requisições feitas ao servidor
server.use((req, res, next) => {
  totalReq++;
  console.log(totalReq);
  next();
});

//Middleware para checar se projeto existe
const checkExistence = (req, res, next) => {
  const { id } = req.params;
  const exists = projects.find(project => project.id == id);
  if (exists) {
    next();
  } else {
    return res.status(404).json('Project not found');
  }
};

// Definição de rotas da api //

//Listar projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//Adicionar novo projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  }
  projects.push(project);
  return res.json(project);
});

//Atualizar titulo do projeto
server.put('/projects/:id', checkExistence, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects.find(project => project.id == id).title = title;
  return res.json(projects);
});

//Deletar Projeto
server.delete('/projects/:id', checkExistence, (req, res) => {
  const { id } = req.params;
  projects.splice(projects.indexOf(projects.find(project => project.id == id)), 1);
  return res.json(projects);
});

//Adicionar tarefa ao projeto
server.post('/projects/:id/tasks', checkExistence, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects.find(project => project.id == id).tasks.push(title);
  return res.json(projects.find(project => project.id == id));
});

//Definindo porta que o server será executado (o servidor escutará a porta xxxx)
server.listen(3333);