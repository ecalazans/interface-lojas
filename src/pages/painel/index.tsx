import { useEffect, useState } from "react";
import axios from "axios";
import { EyeIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon, PlusIcon, ChartBarIcon } from "@heroicons/react/24/solid";

import { EditStatusModal } from "../../components/EditStatusModal";
import { ModalCreateStore } from "../../components/CreateStoreModal";
import { ViewStoreModal } from "../../components/ViewStoreModal";
import { DeleteStoreModal } from "../../components/DeleteStoreModal";

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
  const [selectedView, setSelectedView] = useState<StoreProps | null>(null);
  const [selectedDelete, setSelectedDelete] = useState<StoreProps | null>(null)


  // Carregar lojas da API
  const fetchLojas = async () => {
    try {
      const response = await axios.get("http://localhost:3883/lojas/all");
      setLojas(response.data);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      alert("Não foi possível se comunicar com a API. Verificar com os responsáveis pela aplicação.")
    }
  };

  const reloadStore = async () => {
    alert('Buscando dados da API...')
    await fetchLojas()
    setSearch("")
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
    <div className="p-6 max-w-6xl mx-auto bg-">
      <h1 className="text-2xl font-bold mb-10">
        <div className="flex items-center gap-3">
          <img src="/sintese.svg" alt="" className="w-6 h-6 rounded-sm" /> Controle de Lojas
        </div>
      </h1>

      {/* Barra de busca */}
      <div className="flex justify-between gap-2 mb-4">
        <input
          className="rounded-full border border-gray-400 p-2 w-2xs"
          placeholder="Buscar por CNPJ ou Filial"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex justify-center gap-6">
          <button className="cursor-pointer px-3 py-1 rounded-full border border-gray-400 text-gray-600 text-sm font-medium transition bg-white hover:bg-purple-100" onClick={reloadStore}>
            <div className="flex items-center gap-1">
              <ArrowPathIcon className="w-5 h-5 text-gray-600" /> Atualizar
            </div>
          </button>
          <button
            className="cursor-pointer border border-gray-400 px-4 py-2 rounded-full bg-[#D000FF] text-white hover:bg-[#9f00c2]"
            onClick={() => setIsCreateOpen(true)}
          >
            <div className="flex items-center gap-1">
              <PlusIcon className="w-5 h-5 text-white" /> Novo
            </div>
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="max-h-[75vh] overflow-y-auto border rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-purple-100 sticky top-0">
            <tr>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Marca</th>
              <th className="p-3 text-left">Filial</th>
              <th className="p-3 text-left">CNPJ</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lojasFiltradas.length > 0 ? (
              lojasFiltradas.map((loja, index) => (
                <tr key={index} className="border-t odd:bg-white even:bg-gray-50">
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
                  <td className="p-3 flex gap-2 justify-center">
                    <button className={"p-2 rounded-md transition cursor-pointer hover:bg-gray-300 group"}
                      onClick={() => setSelectedStore(loja)}
                    >
                      <PencilSquareIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </button>
                    <button className="p-2 rounded-md transition cursor-pointer hover:bg-gray-300 group"
                      onClick={() => setSelectedView(loja)}
                    >
                      <EyeIcon className="w-5 h-5 text-gray-600 group-hover:text-[#D000FF]" />
                    </button>
                    <button className="p-2 rounded-md transition cursor-pointer hover:bg-gray-300 group"
                      onClick={() => setSelectedDelete(loja)}
                    >
                      <TrashIcon className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
                    </button>
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
      {/* Modals só é renderizado se onclose != null or false*/}
      {
        selectedStore && (
          <EditStatusModal
            store={selectedStore}
            onClose={() => setSelectedStore(null)}
            onUpdated={fetchLojas}
          />
        )
      }

      {
        isCreateOpen && (
          <ModalCreateStore
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={fetchLojas}
          />
        )
      }

      {
        selectedView && (
          <ViewStoreModal
            store={selectedView}
            onClose={() => setSelectedView(null)}
          />
        )
      }

      {selectedDelete && (
        <DeleteStoreModal
          store={selectedDelete}
          onClose={() => setSelectedDelete(null)}
          onSuccess={fetchLojas}
        />
      )}
    </div >
  );
}
