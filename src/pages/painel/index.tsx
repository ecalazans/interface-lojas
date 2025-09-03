import { useEffect, useState } from "react";
import axios from "axios";
import { EyeIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon, PlusIcon } from "@heroicons/react/24/solid";

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

  const [loading, setLoading] = useState(true)
  const [errorApi, setErrorApi] = useState<string | null>(null)


  // Carregar lojas da API
  const fetchLojas = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://api-lojas-2025.onrender.com/lojas/all");
      setLojas(response.data);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      setErrorApi("⚠️ Não foi possível carregar os dados. Verifique com o administrador do site.");
    } finally {
      setLoading(false)
    }
  };

  const reloadStore = () => {
    alert('Buscando dados da API...')
    fetchLojas()
    setSearch("")
  }

  const refreshLojas = async () => {
    try {
      const response = await axios.get("https://api-lojas-2025.onrender.com/lojas/all");
      setLojas(response.data);
    } catch (err) {
      console.error("Erro ao atualizar lista:", err);
      setErrorApi("⚠️ Não foi possível carregar os dados. Verifique com o administrador do site.");
    }
  };

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

  if (errorApi) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md max-w-md text-center">
          <p className="font-semibold mb-2">Erro de conexão com os dados</p>
          <p>{errorApi}</p>
          <button
            onClick={fetchLojas}
            className="mt-4 px-4 py-2 bg-[#D000FF] text-white rounded-lg hover:bg-[#9f00c2] transition"
          >
            🔄 Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-">
      {/* Renderiza só se não estiver carregando os dados da API */}
      {!loading && !errorApi && (
        <h1 className="text-2xl font-bold mb-10">
          <div className="flex items-center gap-3">
            <img src="/sintese.svg" alt="" className="w-6 h-6 rounded-sm" /> Controle de Lojas
          </div>
        </h1>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D000FF] border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-600 font-medium">Carregando lojas...</p>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {errorApi && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md mb-4 text-center">
          <p className="font-semibold mb-2">Erro de Conexão</p>
          <p>{errorApi}</p>
          <button
            onClick={fetchLojas}
            className="mt-4 px-4 py-2 bg-[#D000FF] text-white rounded-lg hover:bg-[#9f00c2] transition"
          >
            🔄 Tentar novamente
          </button>
        </div>
      )}

      {/* Barra de busca */}
      {/* Renderiza só se não estiver carregando os dados da API */}
      {!loading && !errorApi && (
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
      )}

      {/* Renderiza só se não estiver carregando os dados da API */}
      {!loading && !errorApi && (
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
                      <button className="p-2 rounded-md transition cursor-not-allowed group"
                        onClick={() => setSelectedDelete(loja)}
                        disabled={true}
                      >
                        <TrashIcon className="w-5 h-5 text-gray-300" />
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
      )}


      {/* Modals só é renderizado se onclose != null or false*/}
      {
        selectedStore && (
          <EditStatusModal
            store={selectedStore}
            onClose={() => setSelectedStore(null)}
            onUpdated={refreshLojas}
          />
        )
      }

      {
        isCreateOpen && (
          <ModalCreateStore
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={refreshLojas}
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
          onSuccess={refreshLojas}
        />
      )}
    </div >
  );
}
