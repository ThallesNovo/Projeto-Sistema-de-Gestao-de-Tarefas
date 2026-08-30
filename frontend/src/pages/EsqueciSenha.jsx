import { useState } from "react";
import { Link } from "react-router-dom";
import { esqueciSenha } from "../services/auth";
import "./Login.css";

function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      setErro("Por favor, insira um e-mail válido.");
      return;
    }

    setEnviando(true);
    try {
      const data = await esqueciSenha(email);
      setMensagem(data.mensagem);
    } catch (err) {
      setErro("Não foi possível processar sua solicitação. Tente novamente.");
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Esqueci minha senha</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {erro && <p style={{ color: "red" }}>{erro}</p>}
          {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}

          <button type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar link de redefinição"}
          </button>
        </form>
        <Link to="/login">← Voltar</Link>
      </div>
    </div>
  );
}

export default EsqueciSenha;