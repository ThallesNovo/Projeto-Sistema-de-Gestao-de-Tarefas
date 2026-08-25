import { useNavigate } from "react-router-dom";
import "./Login.css";

function BoasVindas() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Bem-vindo</h1>
        <p>Gerencie suas tarefas de forma simples e organizada.</p>
        <button type="button" onClick={() => navigate("/login")}>
          Entrar
        </button>
        <button
          type="button"
          onClick={() => navigate("/cadastro")}
          style={{ marginTop: "10px", backgroundColor: "#444" }}
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}

export default BoasVindas;