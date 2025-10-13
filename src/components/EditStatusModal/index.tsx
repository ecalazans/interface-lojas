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
  tipo: string,
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
  const [tipo, setTipo] = useState(store?.tipo || "")

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
      const statusMudou = statusAtual !== novoStatus

      const mudouAlgoCampoObrigatorio =
        numeroChamadoInativo !== store.chamado_inativo ||
        motivoInativo !== store.motivo_inativo ||
        responsavelInativo !== store.responsavel_inativo;

      const mudouTipo = tipo !== store.tipo

      const mudouAlgo = statusMudou || mudouAlgoCampoObrigatorio || mudouTipo;

      // 1.) Nenhuma alteração detectada
      if (!mudouAlgo) {
        alert("Nenhuma alteração detectada nos campos")
        return
      }

      // 2.) Se o status mudou, valida os campos obrigatórios
      if (statusMudou) {
        const camposPreenchidos =
          Boolean(numeroChamadoInativo) &&
          Boolean(motivoInativo) &&
          Boolean(responsavelInativo);

        if (!camposPreenchidos) {
          alert("Preencha número do chamado, responsável e motivo antes de salvar.");
          return;
        }

        // 3.) Se o status mudou, exige que altere campos obrigatórios
        if (!mudouAlgoCampoObrigatorio) {
          alert("Altere alguma informação antes de salvar (campos obrigatórios).");
          return;
        }
      }

      // Pode salvar (alteração válida)
      payload = {
        ...payload,
        ...(numeroChamadoInativo !== store.chamado_inativo && { chamado: numeroChamadoInativo }),
        ...(motivoInativo !== store.motivo_inativo && { motivo: motivoInativo }),
        ...(responsavelInativo !== store.responsavel_inativo && { responsavel: responsavelInativo }),
        ...(tipo !== store.tipo && { tipo })
      };
    }

    if (novoStatus === "Ativo") {
      const statusMudou = statusAtual !== novoStatus;

      const mudouAlgoCampoObrigatorio =
        numeroChamadoAtivo !== store.chamado_ativo ||
        motivoAtivo !== store.motivo_ativo ||
        responsavelAtivo !== store.responsavel_ativo

      const mudouTipo = tipo !== store.tipo;

      const mudouAlgo = statusMudou || mudouAlgoCampoObrigatorio || mudouTipo;

      // 1.) Nenhuma alteração detectada
      if (!mudouAlgo) {
        alert("Nenhuma alteração detectada nos campos")
        return
      }

      // 2.) Se o status mudou, valida os campos obrigatórios
      if (statusMudou) {
        const camposPreenchidos =
          Boolean(numeroChamadoAtivo) &&
          Boolean(motivoAtivo) &&
          Boolean(responsavelAtivo);

        if (!camposPreenchidos) {
          alert("Preencha número do chamado, responsável e motivo antes de salvar.");
          return;
        }

        // 3.) Se o status mudou, exige que altere campos obrigatórios
        if (!mudouAlgoCampoObrigatorio) {
          alert("Altere alguma informação antes de salvar (campos obrigatórios).");
          return;
        }
      }

      // Pode salvar (alteração válida)
      payload = {
        ...payload,
        ...(numeroChamadoAtivo !== store.chamado_ativo && { chamado: numeroChamadoAtivo }),
        ...(motivoAtivo !== store.motivo_ativo && { motivo: motivoAtivo }),
        ...(responsavelAtivo !== store.responsavel_ativo && { responsavel: responsavelAtivo }),
        ...(tipo !== store.tipo && { tipo })
      };
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

        <div className="flex justify-between gap-8 mb-4">
          {/* Grupo Status */}
          <div className="flex flex-col justify-between">
            <label className="block mb-2 font-medium">Status</label>
            <div className="flex gap-2 items-center">
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
          </div>

          {/* Grupo Tipo de Loja */}
          <div className="flex flex-col">
            <label className="block font-medium mb-2">Tipo de Loja</label>
            <div className="flex gap-4 items-center mt-auto mb-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="Franquia"
                  checked={tipo === "Franquia"}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-4 h-4 accent-[#D000FF] cursor-pointer"
                />
                <span className="text-gray-700">Franquia</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value="Própria"
                  checked={tipo === "Própria"}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-4 h-4 accent-[#D000FF] cursor-pointer"
                />
                <span className="text-gray-700">Própria</span>
              </label>
            </div>
          </div>
        </div>



        {/* <div className={`space-y-3 mb-4 transition-all duration-300 overflow-hidden ${status === "Inativo" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}> */}
        <div>
          {/* <p className="text-sm text-gray-500 mt-2">Campos marcados com <span className="text-red-500">*</span> são obrigatórios.</p> */}

          <label className="block text-sm font-medium">
            Número do chamado <span className="text-red-500 text-sm">*</span>
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
          <label className="block text-sm font-medium mt-3">
            Responsável <span className="text-red-500 text-sm">*</span></label>
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
          <label className="block text-sm font-medium mt-3">
            Motivo <span className="text-red-500 text-sm">*</span>
          </label>
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
