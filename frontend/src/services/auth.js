import api from "./api";

export async function login(email, senha) {
  const response = await api.post("/login", { email, senha });
  return response.data;
}

export async function cadastrar(nome, sobrenome, email, senha) {
  const response = await api.post("/usuarios/", { nome, sobrenome, email, senha });
  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export async function esqueciSenha(email) {
  const response = await api.post("/esqueci-senha", { email });
  return response.data;
}

export async function redefinirSenha(token, novaSenha) {
  const response = await api.post("/redefinir-senha", { token, nova_senha: novaSenha });
  return response.data;
}