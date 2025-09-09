export function formatCnpj(cnpjString: string): string {
  // Remove tudo que não for número
  const cnpj = cnpjString.replace(/\D/g, "");

  // Aplica a máscara progressiva
  if (cnpj.length <= 2) return cnpj;
  if (cnpj.length <= 5) return cnpj.replace(/^(\d{2})(\d{0,3})/, "$1.$2");
  if (cnpj.length <= 8) return cnpj.replace(/^(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
  if (cnpj.length <= 12)
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})$/, "$1.$2.$3/$4-$5");
}
