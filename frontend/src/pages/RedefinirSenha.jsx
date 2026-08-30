import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { redefinirSenha } from "../services/auth";
import "./Login.css";

function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!token) {
      setErro("Link inválido ou incompleto.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setEnviando(true);
    try {
      const data = await redefinirSenha(token, novaSenha);
      setMensagem(data.mensagem + " Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErro("Token inválido ou expirado. Solicite um novo link.");
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Redefinir senha</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nova senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirmar nova senha</label>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          {erro && <p style={{ color: "red" }}>{erro}</p>}
          {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}

          <button type="submit" disabled={enviando}>
            {enviando ? "Salvando..." : "Redefinir senha"}
          </button>
        </form>
        <Link to="/login">← Voltar para o login</Link>
      </div>
    </div>
  );
}

export default RedefinirSenha;