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