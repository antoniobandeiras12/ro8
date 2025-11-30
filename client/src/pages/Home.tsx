import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header com Logo */}
      <header className="bg-gradient-to-r from-black to-orange-900 border-b-4 border-orange-500 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/brasao.png" alt="Brasão 3º BPChq Humaitá" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-500">Sistema RSO</h1>
              <p className="text-orange-400 text-xs md:text-sm">3º Batalhão de Polícia de Choque Humaitá</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8 md:py-12 px-4 w-full">
        <Card className="w-full max-w-md bg-gray-900 border-2 border-orange-500 hover:border-orange-400 transition-colors">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardTitle className="text-xl md:text-2xl">📋 Enviar Relatório</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              Preencha e envie um novo Relatório de Serviço Operacional com informações detalhadas sobre sua patrulha.
            </p>
            <Button
              onClick={() => setLocation("/rso")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 md:py-3 text-base md:text-lg"
            >
              Acessar Formulário RSO
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
