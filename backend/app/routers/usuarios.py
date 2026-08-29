from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..seguranca import hash_senha

router = APIRouter(prefix="/usuarios", tags=["Usuários"])


@router.post("/", response_model=schemas.UsuarioResposta)
def criar_usuario(usuario: schemas.UsuarioCriar, db: Session = Depends(get_db)):
    usuario_existente = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    novo_usuario = models.Usuario(
        nome=usuario.nome,
        sobrenome=usuario.sobrenome,
        email=usuario.email,
        senha_hash=hash_senha(usuario.senha),
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario