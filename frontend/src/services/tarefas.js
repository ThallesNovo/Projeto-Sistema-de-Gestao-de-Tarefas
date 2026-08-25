import api from "./api";

export async function buscarEstatisticas() {
  const response = await api.get("/tarefas/estatisticas");
  return response.data;
}


export async function listarTarefas(filtros = {}) {
  const params = {};
  if (filtros.status) params.status = filtros.status;
  if (filtros.prioridade) params.prioridade = filtros.prioridade;
  if (filtros.busca) params.busca = filtros.busca;

  const response = await api.get("/tarefas/", { params });
  return response.data;
}

export async function criarTarefa(tarefa) {
  const response = await api.post("/tarefas/", tarefa);
  return response.data;
}

export async function excluirTarefa(id) {
  await api.delete(`/tarefas/${id}`);
}

export async function atualizarTarefa(id, dados) {
  const resposta = await api.put(`/tarefas/${id}`, dados);
  return resposta.data;
}