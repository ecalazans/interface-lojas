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

interface ViewStoreModalProps {
  store: StoreProps;
  onClose: () => void;
}

export function ViewStoreModal({ store, onClose }: ViewStoreModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="p-6 w-full max-w-md bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Informacões da Loja</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-gray-500 font-medium">CNPJ</span>
            <span className="text-gray-800">{store.cnpj}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Filial</span>
            <span className="text-gray-800">{store.filial}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Cliente</span>
            <span className="text-gray-800">{store.cliente}</span>
          </div>
          <div>
            <span className="block text-gray-500 font-medium">Status</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${store.status === "Ativo"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
              {store.status}
            </span>

          </div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 cursor-pointer hover:bg-gray-300 rounded-lg transition"
          >
            Fechar
          </button>

        </div>
      </div>
    </div>
  )
}