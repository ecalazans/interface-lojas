import { useState } from "react";
import { UseAuth } from "../../hooks/auth";

export function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { signIn, loading } = UseAuth()

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // autenticar com o hook
    signIn({ email, password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h1>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D000FF] text-white hover:bg-[#9f00c2] transition cursor-pointer px-4 py-2 rounded-md disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </button>
          {/* <button
            type="submit"
            className="w-full bg-[#D000FF] text-white font-medium py-2 rounded-lg shadow hover:bg-[#9f00c2] transition cursor-pointer"
          >
            Entrar
          </button> */}
        </form>
      </div>
    </div>
  )
}