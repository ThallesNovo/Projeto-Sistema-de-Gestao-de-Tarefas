from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    sobrenome = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hash = Column(String, nullable=False)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())

    projetos = relationship("Projeto", back_populates="dono")


class Projeto(Base):
    __tablename__ = "projetos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    descricao = Column(Text, nullable=True)
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    dono_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    dono = relationship("Usuario", back_populates="projetos")
    tarefas = relationship("Tarefa", back_populates="projeto", cascade="all, delete-orphan")


class Tarefa(Base):
    __tablename__ = "tarefas"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, nullable=False)
    descricao = Column(Text, nullable=True)
    status = Column(String, default="pendente")  # pendente, em_andamento, concluida
    prioridade = Column(String, default="media")  # baixa, media, alta
    criado_em = Column(DateTime(timezone=True), server_default=func.now())
    projeto_id = Column(Integer, ForeignKey("projetos.id"), nullable=False)

    projeto = relationship("Projeto", back_populates="tarefas")