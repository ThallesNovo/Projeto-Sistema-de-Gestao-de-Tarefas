from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..seguranca import get_usuario_atual

router = APIRouter(prefix="/projetos", tags=["Projetos"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def criar_projeto(
    projeto: schemas.ProjetoCriar,
    db: Session = Depends(get_db),
    usuario_atual: models.Usuario = Depends(get_usuario_atual),
):
    novo_projeto = models.Projeto(**projeto.dict(), dono_id=usuario_atual.id)
    db.add(novo_projeto)
    db.commit()
    db.refresh(novo_projeto)
    return novo_projeto


@router.get("/")
def listar_projetos(
    db: Session = Depends(get_db),
    usuario_atual: models.Usuario = Depends(get_usuario_atual),
):
    projetos = db.query(models.Projeto).filter(models.Projeto.dono_id == usuario_atual.id).all()
    return projetos


@router.put("/{projeto_id}")
def atualizar_projeto(
    projeto_id: int,
    dados: schemas.ProjetoBase,
    db: Session = Depends(get_db),
    usuario_atual: models.Usuario = Depends(get_usuario_atual),
):
    projeto = db.query(models.Projeto).filter(models.Projeto.id == projeto_id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    if projeto.dono_id != usuario_atual.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão sobre este projeto")

    for campo, valor in dados.dict(exclude_unset=True).items():
        setattr(projeto, campo, valor)

    db.commit()
    db.refresh(projeto)
    return projeto


@router.delete("/{projeto_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_projeto(
    projeto_id: int,
    db: Session = Depends(get_db),
    usuario_atual: models.Usuario = Depends(get_usuario_atual),
):
    projeto = db.query(models.Projeto).filter(models.Projeto.id == projeto_id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    if projeto.dono_id != usuario_atual.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão sobre este projeto")

    db.delete(projeto)
    db.commit()
    return None