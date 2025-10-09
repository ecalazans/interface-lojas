import { api } from "../services/api"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { toast } from "react-toastify";

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  ativo: boolean;
  last_update_password: string;
  marca: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@store-app:token");
    const user = localStorage.getItem("@store-app:user");

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  async function signIn({ email, password }: SignInCredentials) {
    try {
      setLoading(true)
      // const response = await api.post("/sessions", { email, password });

      // Criar uma instância do axios sem interceptors
      const loginApi = api.create(); // cria uma nova instância
      const response = await loginApi.post("/sessions", { email, password });
      const { user, token } = response.data;

      localStorage.setItem("@store-app:user", JSON.stringify(user));
      localStorage.setItem("@store-app:token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setData({ user, token });

      toast.success("Login realizado com sucesso 🎉", {
        position: "top-right",
        autoClose: 3000,
      });

    } catch (error: any) {
      if (error.response) {
        // mensagem personalizada do backend
        toast.error(error.response.data.message);
      } else {
        // erro por outro motivo que não msg do backend
        toast.error("Não foi possível entrar.");
      }
    } finally {
      setLoading(false)
    }
  }

  function signOut() {
    // mostra notificação
    // toast.success("Sessão encerrada. Até logo! 👋", {
    //   position: "top-right",
    //   autoClose: 3000,
    // });

    setTimeout(() => {
      localStorage.removeItem("@store-app:token");
      localStorage.removeItem("@store-app:user");

      setData({} as AuthState);; // ou o que você usa para limpar o estado
    }, 200);

  }

  useEffect(() => {
    const token = localStorage.getItem("@store-app:token");
    const user = localStorage.getItem("@store-app:user");

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setData({ token, user: JSON.parse(user) });
    }

    // cria o interceptor
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          signOut(); // força logout se o token estiver inválido/expirado
        }
        return Promise.reject(error);
      }
    );

    // cleanup → remove o interceptor ao desmontar
    return () => {
      api.interceptors.response.eject(interceptor);
    };

  }, []);

  return (
    // Provendo os contextos para o children, que no caso serão as rotas
    <AuthContext.Provider value={{
      signIn,
      user: data.user,
      signOut,
      loading: loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function UseAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, UseAuth }