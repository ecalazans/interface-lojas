# 🏪 Controle de Lojas — Frontend

Interface web desenvolvida para gerenciamento das lojas, permitindo visualizar, cadastrar, editar e atualizar o status (ativo/inativo), integrando-se à API que consome o **Google Sheets** como base de dados.

---

## 🚀 Tecnologias Utilizadas

- **React.js (Vite)** — Framework principal do frontend  
- **TypeScript** — Tipagem estática para código mais seguro  
- **Tailwind CSS** — Estilização responsiva e componentizada  
- **Axios** — Comunicação com a API Backend  
- **React Hook Form** — Manipulação e validação de formulários  
- **React Icons** — Ícones modernos e personalizáveis  

---

## 🧠 Ideia do Projeto

O sistema foi criado para centralizar o **controle de lojas**, oferecendo:
- Visualização completa em tabela;
- Edição rápida do status da loja (Ativo/Inativo);
- Registro de número de chamado, responsável e motivo;
- Filtro e pesquisa por nome ou CNPJ;
- Cadastro e gerenciamento de usuários administradores.

---

## 🧩 Estrutura de Pastas
```text
📂 src
 ┣ 📂 assets           # Imagens, ícones e recursos estáticos
 ┣ 📂 components       # Componentes reutilizáveis (botões, modais, inputs)
 ┣ 📂 hooks            # Hooks customizados
 ┣ 📂 pages            # Páginas principais da aplicação (Home, Login, etc)
 ┣ 📂 routes           # Rotas da aplicação
 ┣ 📂 services         # Configuração do Axios e chamadas à API
 ┣ 📂 utils            # Funções auxiliares e constantes
 ┗ 📄 main.tsx         # Inicialização e renderização do React
```
---

## ⚙️ Como Executar o Projeto
```
# 1. Clone o repositório
git clone https://github.com/ecalazans/interface-lojas.git

# 2. Acesse a pasta
cd controle-lojas-frontend

# 3. Instale as dependências
npm install

# 4. Rode o projeto
npm run dev
```

---

## 👨‍💻 Autor
Feito com 💙 por Erick Calazans