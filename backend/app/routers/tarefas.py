from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import func
from .. import models, schemas
from ..database import get_db
from ..seguranca import get_usuario_atual

router = APIRouter(prefix="/tarefas", tags=["Tarefas"])


def verificar_dono_do_projeto(projeto_id: int, usuario_atual: models.Usuario, db: Session):
    """Confirma que o projeto existe e pertence ao usuário logado."""
    projeto = db.query(models.Projeto).filter(models.Projeto.id == projeto_id).first()
    if not projeto:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    if projeto.dono_id != usuario_atual.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão sobre este projeto")
    return projeto


@router.post("/", status_code=status.HTTP_201_CREATED)
def criar_tarefa(
    tarefa: schemas.TarefaCriar,
    db: Session = Depends(get_db),
    usuario_atual: models.Usuario = Depends(get_usuario_atual),
):
    verificar_dono_do_projeto(tarefa.projeto_id, usuario_atual, db)

    nova_tarefa = models.Tarefa(**tarefa.dict())
    db.add(nova_tarefa)
    db.commit()
    db.refresh(nova_tarefa)
    return nova_tarefa


@router.get("/")
def listar_tarefas(
    status: Optional[str] = None,
    prioridade: Optional[str] = None,
    busca: Optional[str] = None,
    db: Session = Depends(get_db),
    usuario_atual: models.Usuario = Depends(get_usuario_atual),
):
    query = (
        db.query(models.Tarefa)
        .join(models.Projeto)
        .filter(models.Projeto.dono_id == usuario_atual.id)
    )

    if status:
        query = query.filter(models.Tarefa.status == status)

    if prioridade:
        query = query.filter(models.Tarefa.prioridade == prioridade)

    if busca:
        query = query.filter(models.Tarefa.titulo.ilike(f"%{busca}%"))

    return query.all()

@router.get("/estatisticas")
def estatisticas_tarefas(
    db: Session = Depends(get_db),
    usuario_atual: models.Usuario = Depends(get_usuario_atual),
):
    base_query = (
        db.query(models.Tarefa)
        .join(models.Projeto)
        .filter(models.Projeto.dono_id == usuario_atual.id)
    )

    total = base_query.count()

    por_status = (
        db.query(models.Tarefa.status, func.count(models.Tarefa.id))
        .join(models.Projeto)
        .filter(models.Projeto.dono_id == usuario_atual.id)
        .group_by(models.Tarefa.status)
        .all()
    )

    por_prioridade = (
        db.query(models.Tarefa.prioridade, func.count(models.Tarefa.id))
        .join(models.Projeto)
        .filter(models.Projeto.dono_id == usuario_atual.id)
        .group_by(models.Tarefa.prioridade)
        .all()
    )

    return {
        "total_tarefas": total,
        "por_status": {status: quantidade for status, quantidade in por_status},
        "por_prioridade": {prioridade: quantidade for prioridade, quantidade in por_prioridade},
    }
@router.put("/{tarefa_id}")
def atualizar_tarefa(
    tarefa_id: int,
    dados: schemas.TarefaBase,
    db: Session = Depends(get_db),
    usuario_atual: models.Usuario = Depends(get_usuario_atual),
):
    tarefa = db.query(models.Tarefa).filter(models.Tarefa.id == tarefa_id).first()
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")

    verificar_dono_do_projeto(tarefa.projeto_id, usuario_atual, db)

    for campo, valor in dados.dict(exclude_unset=True).items():
        setattr(tarefa, campo, valor)

    db.commit()
    db.refresh(tarefa)
    return tarefa


@router.delete("/{tarefa_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_tarefa(
    tarefa_id: int,
    db: Session = Depends(get_db),
    usuario_atual: models.Usuario = Depends(get_usuario_atual),
):
    tarefa = db.query(models.Tarefa).filter(models.Tarefa.id == tarefa_id).first()
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")

    verificar_dono_do_projeto(tarefa.projeto_id, usuario_atual, db)

    db.delete(tarefa)
    db.commit()
    return None