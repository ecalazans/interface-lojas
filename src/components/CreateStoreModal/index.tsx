import { useState } from "react";
import axios from "axios";

interface ModalCreateStoreProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // callback pra recarregar a lista após criar
}

export function ModalCreateStore({ isOpen, onClose, onSuccess, }: ModalCreateStoreProps) {
  const [cnpj, setCnpj] = useState("");
  const [filial, setFilial] = useState("");
  const [cliente, setCliente] = useState("");
  const [marca, setMarca] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    try {
      setLoading(true);

      await axios.post("http://localhost:3883/lojas", {
        cnpj,
        filial,
        cliente,
        marca,
        status: "Ativo",
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
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Cadastrar Nova Loja</h2>

        <input
          type="text"
          placeholder="CNPJ"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          className="w-full border p-2 rounded mb-2 border-gray-300"
        />

        <input
          type="text"
          placeholder="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="w-full border p-2 rounded mb-2 border-gray-300"
        />

        <input
          type="text"
          placeholder="Filial"
          value={filial}
          onChange={(e) => setFilial(e.target.value)}
          className="w-full border p-2 rounded mb-2 border-gray-300"
        />

        <input
          type="text"
          placeholder="Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          className="w-full border p-2 rounded mb-2 border-gray-300"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded transition bg-gray-200 hover:bg-gray-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 rounded transition text-white bg-[#D000FF] hover:bg-[#9f00c2] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
