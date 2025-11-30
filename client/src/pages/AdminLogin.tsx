import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "24032005";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Armazenar token de sessão no localStorage
        localStorage.setItem("adminToken", "authenticated");
        toast.success("Login realizado com sucesso!");
        setTimeout(() => setLocation("/admin-dashboard"), 500);
      } else {
        toast.error("Usuário ou senha incorretos.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-black to-orange-900 border-b-4 border-orange-500 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brasao.png" alt="Brasão 3º BPChq Humaitá" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-500">Sistema RSO - Admin</h1>
              <p className="text-orange-400 text-xs md:text-sm">3º Batalhão de Polícia de Choque Humaitá</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <Card className="w-full max-w-md bg-gray-900 border-2 border-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardTitle className="text-2xl text-center">Acesso Restrito</CardTitle>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-gray-300">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite o usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 mt-6"
              >
                {isLoading ? "Autenticando..." : "Entrar"}
              </Button>
            </form>

            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="w-full mt-4 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black text-sm md:text-base"
            >
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black to-orange-900 border-t-4 border-orange-500 py-6 px-4 text-center text-gray-400 text-xs md:text-sm">
        <p>© 2025 3º Batalhão de Polícia de Choque Humaitá - Sistema RSO</p>
      </footer>
    </div>
  );
}
