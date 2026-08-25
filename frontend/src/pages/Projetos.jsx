import { useState, useEffect } from "react";
import { listarProjetos, criarProjeto } from "../services/projetos";

function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [enviando, setEnviando] = useState(false);

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
            <strong>{projeto.nome}</strong> — {projeto.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Projetos;