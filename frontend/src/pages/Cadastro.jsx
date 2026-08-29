import { useState } from "react";
import { cadastrar } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Cadastro() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
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
      await cadastrar(nome, sobrenome, email, senha);
      setSucesso(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data?.detail) {
        setErro(err.response.data.detail);
      } else {
        setErro("Erro ao cadastrar. Tente novamente.");
      }
      console.error(err);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Cadastro</h1>
        <form onSubmit={handleSubmit}>
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
               <label>Sobrenome</label>
               <input
                 type="text"
                 value={sobrenome}
                 onChange={(e) => setSobrenome(e.target.value)}
                 required
               />
             </div>       
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
          {sucesso && <p style={{ color: "green" }}>Cadastro feito! Redirecionando...</p>}
          <button type="submit">Cadastrar</button>
        </form>
        <p style={{ marginTop: "10px", textAlign: "center" }}> <span style={{ cursor: "pointer", color: "#4caf50" }} onClick={() => navigate("/")}> ← Voltar </span> </p>
      </div>
    </div>
  );
}

export default Cadastro;