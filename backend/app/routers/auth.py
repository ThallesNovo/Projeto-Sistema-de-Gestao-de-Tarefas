from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, seguranca
from ..database import get_db

router = APIRouter()

@router.post("/login")
def login(dados: schemas.LoginSchema, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == dados.email).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not seguranca.verificar_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = seguranca.criar_token_acesso({"sub": usuario.email})

    return {"access_token": token, "token_type": "bearer"}