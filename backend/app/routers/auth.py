from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, seguranca
from ..database import get_db

router = APIRouter()

import uuid
from datetime import datetime, timedelta
from .. import email_utils


@router.post("/login")
def login(dados: schemas.LoginSchema, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == dados.email).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not seguranca.verificar_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    if not usuario.is_verified:
        raise HTTPException(status_code=403, detail="Confirme seu e-mail antes de fazer login")

    token = seguranca.criar_token_acesso({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}



@router.get("/confirmar-email")
def confirmar_email(token: str, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.verification_token == token).first()
    if not usuario:
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")

    usuario.is_verified = True
    usuario.verification_token = None
    db.commit()

    return {"mensagem": "E-mail confirmado com sucesso!"}



@router.post("/esqueci-senha")
def esqueci_senha(dados: schemas.EmailSchema, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == dados.email).first()

    if usuario:
        token = str(uuid.uuid4())
        usuario.reset_token = token
        usuario.reset_token_expira = datetime.utcnow() + timedelta(hours=1)
        db.commit()
        email_utils.enviar_email_redefinicao_senha(usuario.email, token)

    return {"mensagem": "Se o e-mail existir, enviamos um link de redefinição."}



@router.post("/redefinir-senha")
def redefinir_senha(dados: schemas.RedefinirSenhaSchema, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.reset_token == dados.token).first()

    if not usuario or not usuario.reset_token_expira or usuario.reset_token_expira < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token inválido ou expirado")

    usuario.senha_hash = seguranca.hash_senha(dados.nova_senha)
    usuario.reset_token = None
    usuario.reset_token_expira = None
    db.commit()

    return {"mensagem": "Senha redefinida com sucesso!"}