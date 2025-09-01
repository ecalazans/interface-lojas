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

interface DeleteStoreModalProps {
  onClose: () => void;
  onSuccess: () => void;
  store: StoreProps;
}

export function DeleteStoreModal({ store, onClose, onSuccess }: DeleteStoreModalProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true);

      await axios.delete("http://localhost:3883/lojas", {
        data: {
          cnpj: store.cnpj
        }
      });

      onSuccess(); // recarrega a lista de lojas
      onClose(); // fecha modal
    } catch (err) {
      console.error("Erro ao criar loja:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Excluir Loja
        </h2>
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir{" "}
          <span className="font-semibold text-red-500">{store.cliente} - {store.filial}</span>&nbsp;?
          <br />Essa ação não poderá ser desfeita.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg transition bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-white transition bg-[#D000FF] hover:bg-[#9f00c2] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  )
}