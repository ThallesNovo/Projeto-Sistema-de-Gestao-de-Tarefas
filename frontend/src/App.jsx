import { BrowserRouter, Routes, Route } from "react-router-dom";
import BoasVindas from "./pages/BoasVindas";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Tarefas from "./pages/Tarefas";
import Projetos from "./pages/Projetos";
import RotaProtegida from "./components/RotaProtegida";
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BoasVindas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/tarefas"
          element={
            <RotaProtegida>
              <Tarefas />
            </RotaProtegida>
          }
        />
        <Route
          path="/projetos"
          element={
            <RotaProtegida>
              <Projetos />
            </RotaProtegida>
          }
        />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;