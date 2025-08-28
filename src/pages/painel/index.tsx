import { useEffect, useState } from "react";
import axios from "axios";

import { EditStatusModal } from "../../components/EditStatusModal";
import { ModalCreateStore } from "../../components/CreateStoreModal";

interface StoreProps {
  cliente: string,
  marca: string,
  filial: string,
  cnpj: string,
  data_inauguracao: string,
  data_encerramento: string,
  status: string,
  observacoes: string
}

export function Painel() {
  const [lojas, setLojas] = useState<StoreProps[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreProps | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);


  // Carregar lojas da API
  const fetchLojas = async () => {
    try {
      const response = await axios.get("http://localhost:3883/lojas/all");
      setLojas(response.data);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
    }
  };

  const reloadStore = async () => {
    alert('Carregando dados da API...')
    setSearch("")
    await fetchLojas()
  }

  useEffect(() => {
    fetchLojas();
  }, []);

  // Filtro por CNPJ ou Filial
  const lojasFiltradas = lojas.filter(
    (loja) =>
      loja.cnpj?.toLowerCase().includes(search.toLowerCase()) ||
      loja.filial?.toLowerCase().includes(search.toLowerCase()) ||
      loja.cliente?.toLowerCase().includes(search.toLowerCase())
  );
  // console.log(lojasFiltradas)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Painel de Lojas</h1>

      {/* Barra de busca */}
      <div className="flex justify-between gap-2 mb-4">
        <input
          className="rounded-full border border-gray-400 p-2 w-2xs"
          placeholder="Buscar por CNPJ ou Filial"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex justify-center gap-6">
          <button className="cursor-pointer px-3 py-1 rounded-full border border-gray-400 text-black text-sm font-medium transition bg-gray-200 hover:bg-gray-300" onClick={reloadStore}>
            🔄 Atualizar
          </button>
          <button
            className="cursor-pointer border border-gray-400 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600"
            onClick={() => setIsCreateOpen(true)}
          >
            + Novo
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto border rounded-2xl shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Marca</th>
              <th className="p-3 text-left">Filial</th>
              <th className="p-3 text-left">CNPJ</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lojasFiltradas.length > 0 ? (
              lojasFiltradas.map((loja, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{loja.cliente}</td>
                  <td className="p-3">{loja.marca}</td>
                  <td className="p-3">{loja.filial}</td>
                  <td className="p-3">{loja.cnpj}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${loja.status === "Ativo"
                        ? "bg-green-500"
                        : "bg-red-400"
                        }`}
                    >
                      {loja.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button className={"cursor-pointer px-3 py-1 rounded-lg text-white text-sm font-medium transition bg-blue-500 hover:bg-blue-700"}
                      onClick={() => setSelectedStore(loja)}
                    >Editar</button>
                    <button className="cursor-pointer px-3 py-1 rounded-lg text-white text-sm font-medium bg-red-500">Deletar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center text-gray-500">
                  Nenhuma loja encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {selectedStore && (
        <EditStatusModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
          onUpdated={fetchLojas}
        />
      )}

      {isCreateOpen && (
        <ModalCreateStore
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={fetchLojas}
        />
      )}
    </div>
  );
}
