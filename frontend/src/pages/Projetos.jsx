import { useState, useEffect } from "react";
import { listarProjetos, criarProjeto, atualizarProjeto, excluirProjeto } from "../services/projetos";

function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");

  async function carregar() {
    try {
      const dados = await listarProjetos();
      setProjetos(dados);
    } catch (err) {
      setErro("Não foi possível carregar os projetos.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(e) {
    e.preventDefault();
    setEnviando(true);
    try {
      await criarProjeto({ nome, descricao });
      setNome("");
      setDescricao("");
      await carregar();
    } catch (err) {
      alert("Erro ao criar projeto.");
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluir(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir este projeto?");
    if (!confirmar) return;
    try {
      await excluirProjeto(id);
      await carregar();
    } catch (err) {
      alert("Erro ao excluir projeto.");
      console.error(err);
    }
  }

  function handleIniciarEdicao(projeto) {
    setEditandoId(projeto.id);
    setEditNome(projeto.nome);
    setEditDescricao(projeto.descricao);
  }

  function handleCancelarEdicao() {
    setEditandoId(null);
  }

  async function handleSalvarEdicao(id) {
    try {
      await atualizarProjeto(id, {
        nome: editNome,
        descricao: editDescricao,
      });
      setEditandoId(null);
      await carregar();
    } catch (err) {
      alert("Erro ao editar projeto.");
      console.error(err);
    }
  }

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div>
      <h1>Meus Projetos</h1>

      <form onSubmit={handleCriar}>
        <div>
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
        <button type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : "Adicionar Projeto"}
        </button>
      </form>

      <hr />

      {projetos.length === 0 && <p>Nenhum projeto cadastrado ainda.</p>}

      <ul>
        {projetos.map((projeto) => (
          <li key={projeto.id}>
            {editandoId === projeto.id ? (
              <div>
                <input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                />
                <input
                  type="text"
                  value={editDescricao}
                  onChange={(e) => setEditDescricao(e.target.value)}
                />
                <button onClick={() => handleSalvarEdicao(projeto.id)}>Salvar</button>
                <button onClick={handleCancelarEdicao}>Cancelar</button>
              </div>
            ) : (
              <>
                <span>
                  <strong>{projeto.nome}</strong> — {projeto.descricao}
                </span>
                <span>
                  <button onClick={() => handleIniciarEdicao(projeto)}>Editar</button>
                  <button onClick={() => handleExcluir(projeto.id)}>Excluir</button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projetos;