from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ---------- Usuário ----------

class UsuarioBase(BaseModel):
    nome: str
    sobrenome: str
    email: EmailStr


class UsuarioCriar(UsuarioBase):
    senha: str


class UsuarioResposta(UsuarioBase):
    id: int
    criado_em: datetime

    class Config:
        from_attributes = True


class LoginSchema(BaseModel):
    email: EmailStr
    senha: str


class EmailSchema(BaseModel):
    email: EmailStr


class RedefinirSenhaSchema(BaseModel):
    token: str
    nova_senha: str

# ---------- Tarefa ----------

class TarefaBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    status: Optional[str] = "pendente"
    prioridade: Optional[str] = "media"


class TarefaCriar(TarefaBase):
    projeto_id: int


class TarefaResposta(TarefaBase):
    id: int
    criado_em: datetime
    projeto_id: int

    class Config:
        from_attributes = True


# ---------- Projeto ----------

class ProjetoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None


class ProjetoCriar(ProjetoBase):
    pass


class ProjetoResposta(ProjetoBase):
    id: int
    criado_em: datetime
    dono_id: int
    tarefas: List[TarefaResposta] = []

    class Config:
        from_attributes = True