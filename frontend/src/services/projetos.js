import api from "./api";

export async function listarProjetos() {
  const response = await api.get("/projetos/");
  return response.data;
}

export async function criarProjeto(projeto) {
  const response = await api.post("/projetos/", projeto);
  return response.data;
}

export async function atualizarProjeto(id, projeto) {
  const response = await api.put(`/projetos/${id}`, projeto);
  return response.data;
}

export async function excluirProjeto(id) {
  const response = await api.delete(`/projetos/${id}`);
  return response.data;
}