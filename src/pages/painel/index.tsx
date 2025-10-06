import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { UseAuth } from "../../hooks/auth";
import { Link } from "react-router-dom";

import { EyeIcon, PencilSquareIcon, TrashIcon, ArrowDownTrayIcon, PlusIcon, PowerIcon, UsersIcon } from "@heroicons/react/24/solid";
import * as XLSX from "xlsx";

import { EditStatusModal } from "../../components/EditStatusModal";
import { ModalCreateStore } from "../../components/CreateStoreModal";
import { ViewStoreModal } from "../../components/ViewStoreModal";
import { DeleteStoreModal } from "../../components/DeleteStoreModal";
import { formatCnpj } from "../../utils/formatCnpj";

interface StoreProps {
  cliente: string,
  marca: string,
  filial: string,
  cnpj: string,
  data_inauguracao: string,
  data_encerramento: string,
  status: string,
  observacoes: string,
  chamado: string,
  responsavel: string,
  motivo: string,
  tipo: string,
  date_update: string,
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

  const { signOut, user } = UseAuth()

  // Carregar lojas da API
  const fetchLojas = async () => {
    try {
      setLoading(true)
      const response = await api.get("lojas/all");
      setLojas(response.data);
    } catch (error) {
      console.error("Erro ao buscar lojas:", error);
      setErrorApi("⚠️ Não foi possível carregar os dados. Verifique com o administrador do site.");
    } finally {
      setLoading(false)
    }
  };

  // const reloadStore = () => {
  //   alert('Buscando dados da API...')
  //   fetchLojas()
  //   setSearch("")
  // }

  const refreshLojas = async () => {
    try {
      const response = await api.get("lojas/all");
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

  const lojasAtivas = lojasFiltradas.filter(
    (loja) => loja.status === "Ativo"
  )

  const lojasInativas = lojasFiltradas.filter(
    (loja) => loja.status === "Inativo"
  )

  const exportToExcel = () => {
    const lojasDownload = lojasFiltradas.map(loja => ({
      CLIENTE: loja.cliente,
      MARCA: loja.marca,
      FILIAL: loja.filial,
      CNPJ: loja.cnpj,
      TIPO: loja.tipo,
      STATUS: loja.status,
    })
    )

    const worksheets = XLSX.utils.json_to_sheet(lojasDownload)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheets, "Lojas")

    XLSX.writeFile(workbook, "lojas-sintese.xlsx")
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-">
      {/* Renderiza só se não estiver carregando os dados da API */}
      {!loading && !errorApi && (
        <div className="text-2xl mb-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/sintese.svg" alt="" className="w-6 h-6 rounded-sm" /> Controle de Lojas
            </div>
            <div className="flex gap-5">
              <div className={`flex ${user?.perfil === "admin" ? "gap-20" : ""}`}>
                {user?.perfil === "admin" &&
                  <div className="flex flex-col justify-between items-center text-sm text-gray-600">
                    <Link
                      to={"/admin"}
                      title="Gerenciar usuários"
                      className="cursor-pointer p-2 rounded-lg bg-purple-50 hover:bg-purple-100 group"
                    >
                      <UsersIcon className="w-7 h-7" />
                    </Link>
                  </div>
                }
                <div className="flex flex-col justify-between items-center text-sm text-gray-600">
                  {user &&
                    <>
                      <span>Bem-vindo,</span>
                      <strong>{user.nome}</strong>
                    </>
                  }
                </div>
              </div>
              <button
                title="Sair"
                className="cursor-pointer p-2 rounded-lg bg-purple-50 hover:bg-purple-100 group"
                onClick={signOut}
              >
                <PowerIcon className="w-7 h-7 group-hover:text-[#D000FF]" />
              </button>
            </div>
          </div>
        </div>
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
      {/* Renderiza se não estiver carregando os dados da API */}
      {!loading && !errorApi && (
        <div className="flex items-center justify-between gap-2 mb-4">
          <input
            className="rounded-full border border-gray-400 p-2 w-2xs"
            placeholder="Buscar por CNPJ, Filial ou Cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex justify-center gap-4">
            <span className="text-sm text-gray-600">
              Total encontrado: <strong>{lojasFiltradas.length}</strong>
            </span>
            <span className="text-sm text-gray-600">
              Total ativo: <strong>{lojasAtivas.length}</strong>
            </span>
            <span className="text-sm text-gray-600">
              Total inativo: <strong>{lojasInativas.length}</strong>
            </span>
          </div>
          <div className="flex justify-center gap-6">
            {/* <button className="cursor-pointer px-3 py-1 rounded-full border border-gray-400 text-gray-600 text-sm font-medium transition bg-white hover:bg-purple-100" onClick={reloadStore}>
              <div className="flex items-center gap-1">
                <ArrowPathIcon className="w-5 h-5 text-gray-600" /> Atualizar
              </div>
            </button> */}
            <button
              onClick={() => exportToExcel()}
              className="cursor-pointer px-3 py-1 rounded-full border border-gray-400 text-gray-600 text-sm font-medium transition bg-white hover:bg-purple-100"
            >
              <div className="flex items-center gap-1">
                <ArrowDownTrayIcon className="w-5 h-5" /> Baixar relatório
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

      {/* Renderiza se não estiver carregando os dados da API */}
      {!loading && !errorApi && (
        <div className="max-h-[73vh] overflow-y-auto border border-gray-400 rounded-lg shadow-md">
          <table className="w-full scroll-smooth border-collapse">
            <thead className="bg-purple-100 sticky top-0">
              <tr className="border-b border-gray-400">
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Marca</th>
                <th className="p-3 text-left">Filial</th>
                <th className="p-3 text-left">CNPJ</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lojasFiltradas.length > 0 ? (
                lojasFiltradas.map((loja, index) => (
                  <tr key={index} className="border-t odd:bg-white even:bg-gray-50 border-b border-gray-400">
                    <td className="p-3">{loja.cliente}</td>
                    <td className="p-3">{loja.marca}</td>
                    <td className="p-3">{loja.filial}</td>
                    <td className="p-3">{formatCnpj(loja.cnpj)}</td>
                    <td className="p-3">{loja.tipo !== "" ? loja.tipo : "------"}</td>
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
