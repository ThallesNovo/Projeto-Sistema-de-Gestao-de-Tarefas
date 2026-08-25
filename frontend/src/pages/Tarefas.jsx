import { useState, useEffect } from "react";
import { listarTarefas, criarTarefa, excluirTarefa, atualizarTarefa } from "../services/tarefas";
import { listarProjetos } from "../services/projetos";
import "./Tarefas.css";

function Tarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [enviando, setEnviando] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editPrioridade, setEditPrioridade] = useState("media");
  const [projetos, setProjetos] = useState([]);
  const [projetoId, setProjetoId] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [filtroBusca, setFiltroBusca] = useState("");
  
  async function carregar() {
    try {
     const dados = await listarTarefas({
       status: filtroStatus,
       prioridade: filtroPrioridade,
       busca: filtroBusca,
     });
      setTarefas(dados);
            const listaProjetos = await listarProjetos();
      setProjetos(listaProjetos);
      if (listaProjetos.length > 0 && !projetoId) {
        setProjetoId(listaProjetos[0].id);
      }
    } catch (err) {
      setErro("Não foi possível carregar as tarefas.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

 useEffect(() => {
  carregar();
 }, [filtroStatus, filtroPrioridade, filtroBusca]);

  async function handleCriar(e) {
    e.preventDefault();
    setEnviando(true);

    try {
      await criarTarefa({ titulo, descricao, prioridade, projeto_id: projetoId });
      setTitulo("");
      setDescricao("");
      setPrioridade("media");
      await carregar();
    } catch (err) {
      alert("Erro ao criar tarefa.");
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluir(id) {
  const confirmar = window.confirm("Tem certeza que deseja excluir esta tarefa?");
  if (!confirmar) return;

  try {
    await excluirTarefa(id);
    await carregar();
  } catch (err) {
    alert("Erro ao excluir tarefa.");
    console.error(err);
  }
}

async function handleConcluir(tarefa) {
  try {
    await atualizarTarefa(tarefa.id, {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao,
      status: "concluida",
      prioridade: tarefa.prioridade,
    });
    await carregar();
  } catch (err) {
    alert("Erro ao concluir tarefa.");
    console.error(err);
  }
}

function handleIniciarEdicao(tarefa) {
  setEditandoId(tarefa.id);
  setEditTitulo(tarefa.titulo);
  setEditDescricao(tarefa.descricao);
  setEditPrioridade(tarefa.prioridade);
}

function handleCancelarEdicao() {
  setEditandoId(null);
}

async function handleSalvarEdicao(id) {
  try {
    await atualizarTarefa(id, {
      titulo: editTitulo,
      descricao: editDescricao,
      prioridade: editPrioridade,
    });
    setEditandoId(null);
    await carregar();
  } catch (err) {
    alert("Erro ao editar tarefa.");
    console.error(err);
  }
}

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

 return (
  <div className="tarefas-container">
    <h1>Minhas Tarefas</h1>

    <form onSubmit={handleCriar} className="tarefas-form">
      <div>
        <label>Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Descrição</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>
      <div>
        <label>Prioridade</label>
        <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>
      <div>
        <label>Projeto</label>
        <select value={projetoId} onChange={(e) => setProjetoId(e.target.value)}>
          {projetos.map((projeto) => (
            <option key={projeto.id} value={projeto.id}>
              {projeto.nome}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={enviando}>
        {enviando ? "Salvando..." : "Adicionar Tarefa"}
      </button>
    </form>

    <div className="tarefas-filtros">
      <label>Status</label>
      <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
        <option value="">Todos</option>
        <option value="pendente">Pendente</option>
        <option value="concluida">Concluída</option>
      </select>

      <label>Prioridade</label>
      <select
        value={filtroPrioridade}
        onChange={(e) => setFiltroPrioridade(e.target.value)}
      >
        <option value="">Todas</option>
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
      </select>

      <label>Buscar</label>
      <input
        type="text"
        value={filtroBusca}
        onChange={(e) => setFiltroBusca(e.target.value)}
        placeholder="Buscar por título..."
      />
    </div>

    {tarefas.length === 0 && <p>Nenhuma tarefa cadastrada ainda.</p>}

    <ul className="tarefas-lista">
      {tarefas.map((tarefa) => (
        <li key={tarefa.id} className="tarefa-item">
          {editandoId === tarefa.id ? (
            <div>
              <input
                type="text"
                value={editTitulo}
                onChange={(e) => setEditTitulo(e.target.value)}
              />
              <input
                type="text"
                value={editDescricao}
                onChange={(e) => setEditDescricao(e.target.value)}
              />
              <select
                value={editPrioridade}
                onChange={(e) => setEditPrioridade(e.target.value)}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
              <button onClick={() => handleSalvarEdicao(tarefa.id)}>Salvar</button>
              <button onClick={handleCancelarEdicao}>Cancelar</button>
            </div>
          ) : (
            <>
              <span>
                <strong>{tarefa.titulo}</strong> — {tarefa.status} — {tarefa.prioridade}
              </span>
              <span className="tarefa-botoes">
                <button className="btn-concluir" onClick={() => handleConcluir(tarefa)}>
                  Concluir
                </button>
                <button className="btn-excluir" onClick={() => handleExcluir(tarefa.id)}>
                  Excluir
                </button>
                <button className="btn-editar" onClick={() => handleIniciarEdicao(tarefa)}>
                  Editar
                </button>
              </span>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
);
}
export default Tarefas;