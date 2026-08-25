from fastapi import FastAPI
from .routers import usuarios, auth, tarefas, projetos
from .seguranca import get_usuario_atual
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API de Gestão de Tarefas")

app.add_middleware(
    CORSMiddleware,
allow_origins=[
    "http://localhost:5173",
    "https://projeto-sistema-de-gestao-de-tarefa.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuarios.router)
app.include_router(auth.router)
app.include_router(tarefas.router)
app.include_router(projetos.router)


@app.get("/")
def raiz():
    return {"mensagem": "API rodando com sucesso!"}

@app.get("/rota-protegida")
def rota_protegida(usuario_email: str = Depends(get_usuario_atual)):
    return {"mensagem": f"Você está autenticado como {usuario_email}"}