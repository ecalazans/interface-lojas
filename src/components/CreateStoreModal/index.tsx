import { useState } from "react";
import { api } from "../../services/api";
import { cnpj } from "cpf-cnpj-validator";
import { formatCnpj } from "../../utils/formatCnpj";

interface ModalCreateStoreProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // callback pra recarregar a lista após criar
}

export function ModalCreateStore({ isOpen, onClose, onSuccess, }: ModalCreateStoreProps) {
  const [cnpjInput, setCnpj] = useState("");
  const [error, setError] = useState("");
  const [filial, setFilial] = useState("");
  const [cliente, setCliente] = useState("");
  const [marca, setMarca] = useState("");
  const [loading, setLoading] = useState(false);
  // const [tipo, setTipo] = useState("");

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!cnpjInput || !filial || !cliente || !marca) {
      return alert("É obrigatório o preenchimento de todos os campos")
    } else if (!cnpj.isValid(cnpjInput)) {
      return alert("O CNPJ não é válido, verifique e tente novamente.")
    }

    // Remove tudo que não for número
    const cnpjFormated = cnpjInput.replace(/\D/g, "");

    try {
      setLoading(true);

      await api.post("/lojas", {
        cnpj: cnpjFormated,
        filial,
        cliente,
        marca,
        status: "Ativo",
      });

      onSuccess(); // recarrega a lista de lojas
      onClose(); // fecha modal
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  // remove caracteres não numéricos
  const handleChangeCnpj = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = (e.target.value.replace(/\D/g, ""));

    const formatted = cnpj.format(raw)
    setCnpj(formatted)

    if (raw.length === 14 && !cnpj.isValid(raw)) {
      setError("CNPJ inválido")
    } else {
      setError("")
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Cadastrar Nova Loja</h2>

        <div>
          <input
            type="text"
            value={formatCnpj(cnpjInput)}
            onChange={handleChangeCnpj}
            className="w-full border p-2 rounded mb-2 border-gray-300"
            maxLength={18}
            placeholder="CNPJ"
          />
          {error && <span className="text-red-500 text-sm -mt-1 block">{error}</span>}
        </div>


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

        {/* <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tipo de Loja</label>
          <div className="flex gap-4 items-center">
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
        </div> */}

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
