import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

    async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
     setErro("Por favor, insira um e-mail válido.");
     return;
    }

    try {
      const data = await login(email, senha);
      localStorage.setItem("token", data.access_token);   // ← já existia
      navigate("/dashboard");                               // ← NOVA linha, adicione logo abaixo
    } catch (err) {
      setErro("Email ou senha inválidos.");
      console.error(err);
    }
  }

  return (
    <div className="login-container">
         <div className="login-box"><h1>Login</h1>
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
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        {erro && <p className="erro">{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
      <p style={{ marginTop: "10px", textAlign: "center" }}> <span style={{ cursor: "pointer", color: "#4caf50" }} onClick={() => navigate("/")}> ← Voltar </span> </p>
      </div>
    </div>
  );
}

export default Login;