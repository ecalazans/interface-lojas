import { useState, useEffect } from "react";
import { api } from "../../services/api";

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  marca: string;
  ativo: string;
}

export function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [perfil, setPerfil] = useState("user");
  const [marca, setMarca] = useState("");

  // Buscar usuários da API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users"); // rota do seu backend
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handler de input
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/users", {
        nome,
        email,
        password,
        perfil,
        ativo: true,
        marca
      });

      alert("Usuário criado com sucesso!");
      setNome("");
      setEmail("");
      setPassword("");
      setPerfil("user");
      setMarca("");

      fetchUsers()
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao criar usuário");
    }
  }


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Lista de usuários */}
      <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-300">
        <h2 className="text-xl font-bold mb-4">Usuários</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <ul className="space-y-3">
            {users.map(user => (
              <li key={user.id} className="bg-white shadow rounded-lg p-4 flex justify-between">
                <div>
                  <p className="font-semibold">{user.nome}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">Perfil: {user.perfil} | Marca: {user.marca === "ALL" ? "Todas" : user.marca}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${user.ativo === "TRUE" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                    }`}
                >
                  {user.ativo === "TRUE" ? "Ativo" : "Inativo"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulário de cadastro */}
      <div className="w-1/2 p-6">
        <h2 className="text-xl font-bold mb-4">Cadastrar Usuário</h2>
        <form onSubmit={handleCreateUser} className="space-y-4 bg-white p-6 shadow rounded-lg">
          <input
            type="text"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full border rounded px-3 py-2"
            required
          />
          <select
            name="perfil"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
          <input
            type="text"
            name="marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Marca"
            className="w-full border rounded px-3 py-2"
            required
          />
          {/* <select
            name="ativo"
            value={}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="TRUE">Ativo</option>
            <option value="FALSE">Inativo</option>
          </select> */}

          <button
            type="submit"
            className="w-full bg-[#D000FF] text-white py-2 rounded hover:bg-[#9f00c2] transition cursor-pointer"
          >
            Criar Usuário
          </button>
        </form>
      </div>
    </div>
  );
}
