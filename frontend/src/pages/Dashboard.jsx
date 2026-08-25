import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buscarEstatisticas } from "../services/tarefas";
import { logout } from "../services/auth";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const [estatisticas, setEstatisticas] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");


  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await buscarEstatisticas();
        setEstatisticas(dados);
      } catch (err) {
        setErro("Não foi possível carregar as estatísticas.");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    
    <div className="dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Sair</button>
      </div>

      <div className="cards">
        <div className="card">
          <span className="card-numero">{estatisticas.total_tarefas}</span>
          <span className="card-label">Total de tarefas</span>
        </div>

        {Object.entries(estatisticas.por_status).map(([status, qtd]) => (
          <div className="card" key={status}>
            <span className="card-numero">{qtd}</span>
            <span className="card-label">Status: {status}</span>
          </div>
        ))}

        {Object.entries(estatisticas.por_prioridade).map(([prioridade, qtd]) => (
          <div className="card" key={prioridade}>
            <span className="card-numero">{qtd}</span>
            <span className="card-label">Prioridade: {prioridade}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;