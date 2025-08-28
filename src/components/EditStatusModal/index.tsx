import { useState } from "react";
import axios from "axios";

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

interface EditStatusModalProps {
  store: StoreProps;
  onClose: () => void;
  onUpdated: () => void;
}

export function EditStatusModal({ store, onClose, onUpdated }: EditStatusModalProps) {
  const [status, setStatus] = useState(store?.status || "");
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await axios.put(`http://localhost:3883/lojas`, {
        id: store.cnpj,
        novoStatus: status,
      });
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
          <p><strong>CNPJ:</strong> {store.cnpj}</p>
        </div>

        <label className="block mb-2 font-medium">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        >
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white transition ${loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
