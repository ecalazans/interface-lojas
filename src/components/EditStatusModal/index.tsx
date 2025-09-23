import { useState } from "react";
import { api } from "../../services/api";
import { formatCnpj } from "../../utils/formatCnpj";

interface StoreProps {
  cliente: string,
  marca: string,
  filial: string,
  cnpj: string,
  data_inauguracao: string,
  data_encerramento: string,
  status: string,
  observacoes: string
  chamado_inativo?: string,
  responsavel_inativo?: string,
  motivo_inativo?: string,
  date_update_inativo?: string,
  chamado_ativo?: string,
  responsavel_ativo?: string,
  motivo_ativo?: string,
  date_update_ativo?: string,
}

interface EditStatusModalProps {
  store: StoreProps;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditStatusModal({ store, onClose, onUpdated }: EditStatusModalProps) {
  const [status, setStatus] = useState(store?.status || "");
  const [loading, setLoading] = useState(false);

  // campos inativo
  const [numeroChamadoInativo, setNumeroChamadoInativo] = useState(store?.chamado_inativo || "");
  const [motivoInativo, setMotivoInativo] = useState(store?.motivo_inativo || "");
  const [responsavelInativo, setResponsavelInativo] = useState(store?.responsavel_inativo || "");

  // campos ativo
  const [numeroChamadoAtivo, setNumeroChamadoAtivo] = useState(store?.chamado_ativo || "");
  const [motivoAtivo, setMotivoAtivo] = useState(store?.motivo_ativo || "");
  const [responsavelAtivo, setResponsavelAtivo] = useState(store?.responsavel_ativo || "");


  const handleSave = async () => {
    const statusAtual = store?.status
    const novoStatus = status
    console.log(statusAtual)
    console.log(novoStatus)

    let mudodouAlgo = false
    let payload: any = {
      id: store.cnpj,
      novoStatus
    }

    // If para o primeiro caso, que era somente Inativo
    // if (statusAtual === novoStatus) {
    //   alert("Nenhuma alteração detectada");
    //   return
    // }

    if (novoStatus === "Inativo") {
      mudodouAlgo =
        statusAtual !== novoStatus ||
        numeroChamadoInativo !== store.chamado_inativo ||
        motivoInativo !== store.motivo_inativo ||
        responsavelInativo !== store.responsavel_inativo;

      if (!mudodouAlgo) {
        alert("Nenhuma alteração detectada nos campos")
        return
      }

      if (!numeroChamadoInativo || !motivoInativo || !responsavelInativo) {
        alert("Preencha número do chamado, responsável e motivo antes de salvar.");
        return
      }

      payload = {
        ...payload,
        chamado: numeroChamadoInativo,
        responsavel: responsavelInativo,
        motivo: motivoInativo
      }
    }

    if (novoStatus === "Ativo") {
      mudodouAlgo =
        statusAtual !== novoStatus ||
        numeroChamadoAtivo !== store.chamado_ativo ||
        motivoAtivo !== store.motivo_ativo ||
        responsavelAtivo !== store.responsavel_ativo;

      if (!mudodouAlgo) {
        alert("Nenhuma alteração detectada nos campos")
        return
      }

      if (!numeroChamadoAtivo || !motivoAtivo || !responsavelAtivo) {
        alert("Preencha número do chamado, responsável e motivo antes de salvar.");
        return
      }

      payload = {
        ...payload,
        chamado: numeroChamadoAtivo,
        responsavel: responsavelAtivo,
        motivo: motivoAtivo
      }
    }

    setLoading(true)
    try {
      await api.put("/lojas", payload);
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="p-6 w-full max-w-md bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Status</h2>

        <div className="mb-3">
          <p><strong>Cliente:</strong> {store.cliente}</p>
          <p><strong>Marca:</strong> {store.marca}</p>
          <p><strong>Filial:</strong> {store.filial}</p>
          <p><strong>CNPJ:</strong> {formatCnpj(store.cnpj)}</p>
        </div>

        <label className="block mb-2 font-medium">Status</label>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setStatus("Ativo")}
            className={`cursor-pointer px-4 py-2 rounded-md border transition ${status === "Ativo"
              ? "bg-green-500 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            Ativo
          </button>
          <button
            type="button"
            onClick={() => setStatus("Inativo")}
            className={`cursor-pointer px-4 py-2 rounded-md border transition ${status === "Inativo"
              ? "bg-red-500 text-white border-red-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            Inativo
          </button>
        </div>


        {/* <div className={`space-y-3 mb-4 transition-all duration-300 overflow-hidden ${status === "Inativo" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}> */}
        <div>
          <label className="block text-sm font-medium">
            Número do chamado
          </label>
          <input
            type="text"
            value={status === "Inativo" ? numeroChamadoInativo : numeroChamadoAtivo}
            onChange={(e) => {
              if (status === "Inativo") {
                setNumeroChamadoInativo(e.target.value)
              } else {
                setNumeroChamadoAtivo(e.target.value)
              }
            }}
            className="w-full border rounded-md px-3 py-2 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Responsável</label>
          <input
            type="text"
            value={status === "Inativo" ? responsavelInativo : responsavelAtivo}
            onChange={(e) => {
              if (status === "Inativo") {
                setResponsavelInativo(e.target.value)
              } else {
                setResponsavelAtivo(e.target.value)
              }
            }}
            className="w-full border rounded-md px-3 py-2 border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Motivo</label>
          <textarea
            value={status === "Inativo" ? motivoInativo : motivoAtivo}
            onChange={(e) => {
              if (status === "Inativo") {
                setMotivoInativo(e.target.value)
              } else {
                setMotivoAtivo(e.target.value)
              }
            }}
            className="w-full border rounded-md px-3 py-2 h-36 border-gray-300"
          />
        </div>
        {/* </div> */}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`cursor-pointer px-4 py-2 rounded-lg text-white transition ${loading
              ? "bg-[#ea91fa] cursor-not-allowed"
              : "bg-[#D000FF] hover:bg-[#9f00c2]"
              }`}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
