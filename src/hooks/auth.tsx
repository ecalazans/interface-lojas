import { api } from "../services/api"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
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
      const response = await api.post("/sessions", { email, password });
      const { user, token } = response.data;

      localStorage.setItem("@store-app:user", JSON.stringify(user));
      localStorage.setItem("@store-app:token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setData({ user, token });

    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message); // mensagem personalizada do backend
      } else {
        alert("Não foi possível entrar."); // erro por outro motivo que não msg do backend
      }
    } finally {
      setLoading(false)
    }
  }

  function signOut() {
    localStorage.removeItem("@store-app:token");
    localStorage.removeItem("@store-app:user");

    setData({} as AuthState);
  }

  useEffect(() => {
    const token = localStorage.getItem("@store-app:token");
    const user = localStorage.getItem("@store-app:user");

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setData({ token, user: JSON.parse(user) });
    }

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