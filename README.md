# 📋 Sistema de Gestão de Tarefas

Sistema full-stack para gerenciamento de tarefas e projetos, com autenticação de usuários, dashboard com estatísticas e CRUD completo.

🔗 **Acesse o projeto:** [projeto-sistema-de-gestao-de-tarefa.vercel.app](https://projeto-sistema-de-gestao-de-tarefa.vercel.app)

## 🚀 Tecnologias

- **Frontend:** React + Vite
- **Backend:** Python + FastAPI
- **Banco de dados:** PostgreSQL
- **Autenticação:** Login/Cadastro com rotas protegidas
- **Deploy:** Vercel (frontend) + Render (backend)

## ✨ Funcionalidades

- Cadastro e login de usuários com autenticação
- CRUD completo de tarefas (criar, editar, concluir, excluir)
- CRUD completo de projetos (criar, editar, excluir)
- Filtros por status, prioridade e busca por título
- Dashboard com estatísticas em tempo real
- Navegação entre tela de boas-vindas, login/cadastro e área logada

## 📚 Documentação da API

A API conta com documentação interativa gerada automaticamente pelo FastAPI (Swagger UI).

🔗 **Acesse a documentação:** [https://projeto-sistema-de-gestao-de-tarefas.onrender.com/docs](https://projeto-sistema-de-gestao-de-tarefas.onrender.com/docs)

### Principais endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/cadastro` | Cria um novo usuário |
| POST | `/login` | Autentica o usuário e retorna o token |
| GET | `/tarefas/` | Lista tarefas (com filtros de status, prioridade e busca) |
| POST | `/tarefas/` | Cria uma nova tarefa |
| PUT | `/tarefas/{id}` | Atualiza uma tarefa |
| DELETE | `/tarefas/{id}` | Exclui uma tarefa |
| GET | `/projetos/` | Lista projetos |
| POST | `/projetos/` | Cria um novo projeto |
| PUT | `/projetos/{id}` | Atualiza um projeto |
| DELETE | `/projetos/{id}` | Exclui um projeto |

## 🛠️ Como rodar localmente

### Backend
\`\`\`bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 👤 Autor

Desenvolvido por Thalles Novo como projeto de portfólio full-stack.