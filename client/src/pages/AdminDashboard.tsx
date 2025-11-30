import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Download, Eye } from "lucide-react";
import * as XLSX from "xlsx";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRelatorio, setSelectedRelatorio] = useState<any>(null);

  // Verificar autenticação
  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("adminToken") === "authenticated";

  // Carregar relatórios
  const { data: relatorios = [], isLoading, error, refetch } = trpc.rso.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Debug
  useEffect(() => {
    console.log("AdminDashboard - isAuthenticated:", isAuthenticated);
    console.log("AdminDashboard - relatorios:", relatorios);
    console.log("AdminDashboard - isLoading:", isLoading);
    console.log("AdminDashboard - error:", error);
  }, [relatorios, isLoading, error, isAuthenticated]);

  // Filtrar relatórios
  const filteredRelatorios = useMemo(() => {
    if (!relatorios || relatorios.length === 0) return [];
    return relatorios.filter((rel: any) =>
      rel.encarregadoNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rel.encarregadoSobrenome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rel.viaturaPrefixo?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [relatorios, searchTerm]);

  // Exportar CSV
  const handleExportCSV = () => {
    if (!filteredRelatorios || filteredRelatorios.length === 0) {
      toast.error("Nenhum relatório para exportar.");
      return;
    }

    const headers = [
      "ID",
      "Data Criação",
      "Encarregado",
      "Patente",
      "Viatura",
      "Data Início",
      "Data Fim",
      "Total Ocorrências",
      "Drogas",
      "Dinheiro",
      "Armamento",
      "Munição",
      "Bombas",
      "Lockpik",
    ];

    const rows = filteredRelatorios.map((rel: any) => [
      rel.id,
      new Date(rel.createdAt).toLocaleDateString("pt-BR"),
      `${rel.encarregadoNome} ${rel.encarregadoSobrenome}`,
      rel.encarregadoPatente,
      rel.viaturaPrefixo,
      new Date(rel.dataInicio).toLocaleDateString("pt-BR"),
      new Date(rel.dataFim).toLocaleDateString("pt-BR"),
      rel.totalOcorrencias,
      rel.drogasApreendidas,
      rel.dinheiroSujoApreendido,
      rel.armamentoApreendido,
      rel.municaoApreendida,
      rel.bombasApreendidas,
      rel.lockpikApreendidas,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorios_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("Relatórios exportados em CSV!");
  };

  // Exportar TXT
  const handleExportTXT = () => {
    if (!filteredRelatorios || filteredRelatorios.length === 0) {
      toast.error("Nenhum relatório para exportar.");
      return;
    }

    let txt = "RELATÓRIOS DE SERVIÇO OPERACIONAL (RSO)\n";
    txt += "3º Batalhão de Polícia de Choque Humaitá\n";
    txt += `Exportado em: ${new Date().toLocaleString("pt-BR")}\n`;
    txt += "=".repeat(80) + "\n\n";

    filteredRelatorios.forEach((rel: any, index: number) => {
      txt += `RELATÓRIO ${index + 1}\n`;
      txt += "-".repeat(80) + "\n";
      txt += `ID: ${rel.id}\n`;
      txt += `Data de Criação: ${new Date(rel.createdAt).toLocaleString("pt-BR")}\n`;
      txt += `Encarregado: ${rel.encarregadoNome} ${rel.encarregadoSobrenome} (${rel.encarregadoPatente})\n`;
      txt += `Viatura: ${rel.viaturaPrefixo}\n`;
      txt += `Data de Início: ${new Date(rel.dataInicio).toLocaleString("pt-BR")}\n`;
      txt += `Data de Fim: ${new Date(rel.dataFim).toLocaleString("pt-BR")}\n`;
      txt += `Total de Ocorrências: ${rel.totalOcorrencias}\n`;
      txt += `Drogas Apreendidas: ${rel.drogasApreendidas}\n`;
      txt += `Dinheiro Apreendido: R$ ${rel.dinheiroSujoApreendido}\n`;
      txt += `Armamento Apreendido: ${rel.armamentoApreendido}\n`;
      txt += `Munição Apreendida: ${rel.municaoApreendida}\n`;
      txt += `Bombas Apreendidas: ${rel.bombasApreendidas}\n`;
      txt += `Lockpik Apreendidas: ${rel.lockpikApreendidas}\n`;
      txt += "\n";
    });

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorios_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();

    toast.success("Relatórios exportados em TXT!");
  };

  // Exportar Excel
  const handleExportExcel = () => {
    if (!filteredRelatorios || filteredRelatorios.length === 0) {
      toast.error("Nenhum relatório para exportar.");
      return;
    }

    const data = filteredRelatorios.map((rel: any) => ({
      ID: rel.id,
      "Data Criação": new Date(rel.createdAt).toLocaleDateString("pt-BR"),
      Encarregado: `${rel.encarregadoNome} ${rel.encarregadoSobrenome}`,
      Patente: rel.encarregadoPatente,
      Viatura: rel.viaturaPrefixo,
      "Data Início": new Date(rel.dataInicio).toLocaleDateString("pt-BR"),
      "Data Fim": new Date(rel.dataFim).toLocaleDateString("pt-BR"),
      "Total Ocorrências": rel.totalOcorrencias,
      Drogas: rel.drogasApreendidas,
      Dinheiro: rel.dinheiroSujoApreendido,
      Armamento: rel.armamentoApreendido,
      Munição: rel.municaoApreendida,
      Bombas: rel.bombasApreendidas,
      Lockpik: rel.lockpikApreendidas,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatórios");
    XLSX.writeFile(workbook, `relatorios_${new Date().toISOString().split("T")[0]}.xlsx`);

    toast.success("Relatórios exportados em Excel!");
  };

  // Se não está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="bg-gradient-to-r from-black to-orange-900 border-b-4 border-orange-500 py-4 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/brasao.png" alt="Brasão 3º BPChq Humaitá" className="h-16 w-16 object-contain" />
              <div>
                <h1 className="text-3xl font-bold text-orange-500">Sistema RSO - Admin</h1>
                <p className="text-orange-400 text-sm">3º Batalhão de Polícia de Choque Humaitá</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto py-12 px-4 w-full">
          <Card className="bg-gray-900 border-2 border-orange-500">
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
              <CardTitle className="text-2xl">Acesso Restrito</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-4">
              <p className="text-gray-300 text-center">
                Você precisa fazer login para acessar a área de administração.
              </p>
              <Button
                onClick={() => setLocation("/admin-rso-humaitá")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 text-lg"
              >
                Fazer Login
              </Button>
              <Button
                onClick={() => setLocation("/")}
                variant="outline"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
              >
                Voltar para Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Se está carregando
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="bg-gradient-to-r from-black to-orange-900 border-b-4 border-orange-500 py-4 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <img src="/brasao.png" alt="Brasão 3º BPChq Humaitá" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-3xl font-bold text-orange-500">Sistema RSO - Admin</h1>
              <p className="text-orange-400 text-sm">3º Batalhão de Polícia de Choque Humaitá</p>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-orange-400">Carregando relatórios...</p>
          </div>
        </main>
      </div>
    );
  }

  // Se há erro
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="bg-gradient-to-r from-black to-orange-900 border-b-4 border-orange-500 py-4 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <img src="/brasao.png" alt="Brasão 3º BPChq Humaitá" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-3xl font-bold text-orange-500">Sistema RSO - Admin</h1>
              <p className="text-orange-400 text-sm">3º Batalhão de Polícia de Choque Humaitá</p>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-2xl mx-auto py-12 px-4 w-full">
          <Card className="bg-gray-900 border-2 border-red-500">
            <CardHeader className="bg-red-600 text-white">
              <CardTitle>Erro ao Carregar Relatórios</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-4">
              <p className="text-gray-300">Ocorreu um erro ao tentar carregar os relatórios.</p>
              <p className="text-gray-400 text-sm">{error?.message || "Erro desconhecido"}</p>
              <Button
                onClick={() => refetch()}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Dashboard principal
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-black to-orange-900 border-b-4 border-orange-500 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/brasao.png" alt="Brasão 3º BPChq Humaitá" className="h-16 w-16 object-contain" />
            <div>
              <h1 className="text-3xl font-bold text-orange-500">Sistema RSO - Admin</h1>
              <p className="text-orange-400 text-sm">3º Batalhão de Polícia de Choque Humaitá</p>
            </div>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("adminToken");
              setLocation("/");
            }}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
          >
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto py-8 px-4 w-full">
        <Card className="bg-gray-900 border-2 border-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardTitle className="text-2xl">Relatórios de Serviço Operacional (RSO)</CardTitle>
            <CardDescription className="text-orange-100">
              Total de relatórios: {relatorios.length}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Filtro e Exportação */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="search" className="text-gray-300">
                  Buscar por nome, sobrenome ou viatura
                </Label>
                <Input
                  id="search"
                  placeholder="Digite para filtrar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 mt-2"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleExportCSV}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
                <Button
                  onClick={handleExportTXT}
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar TXT
                </Button>
                <Button
                  onClick={handleExportExcel}
                  className="bg-purple-600 hover:bg-purple-700 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </Button>
              </div>
            </div>

            {/* Tabela de Relatórios */}
            {filteredRelatorios && filteredRelatorios.length > 0 ? (
              <div className="overflow-x-auto border border-gray-700 rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-800">
                    <TableRow>
                      <TableHead className="text-orange-400">ID</TableHead>
                      <TableHead className="text-orange-400">Data</TableHead>
                      <TableHead className="text-orange-400">Encarregado</TableHead>
                      <TableHead className="text-orange-400">Patente</TableHead>
                      <TableHead className="text-orange-400">Viatura</TableHead>
                      <TableHead className="text-orange-400">Data Início</TableHead>
                      <TableHead className="text-orange-400">Ocorrências</TableHead>
                      <TableHead className="text-orange-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRelatorios.map((rel: any) => (
                      <TableRow key={rel.id} className="border-gray-700 hover:bg-gray-800">
                        <TableCell className="text-gray-300">{rel.id}</TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(rel.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {rel.encarregadoNome} {rel.encarregadoSobrenome}
                        </TableCell>
                        <TableCell className="text-gray-300">{rel.encarregadoPatente}</TableCell>
                        <TableCell className="text-gray-300">{rel.viaturaPrefixo}</TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(rel.dataInicio).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-gray-300">{rel.totalOcorrencias}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedRelatorio(rel)}
                            className="gap-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhum relatório encontrado.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalhes */}
        {selectedRelatorio && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <Card className="bg-gray-900 border-2 border-orange-500 max-w-2xl w-full max-h-96 overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white sticky top-0">
                <CardTitle>Detalhes do Relatório #{selectedRelatorio.id}</CardTitle>
                <button
                  onClick={() => setSelectedRelatorio(null)}
                  className="absolute top-4 right-4 text-white hover:text-orange-300"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-gray-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-orange-400 font-semibold">Encarregado</p>
                    <p>{selectedRelatorio.encarregadoNome} {selectedRelatorio.encarregadoSobrenome}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Patente</p>
                    <p>{selectedRelatorio.encarregadoPatente}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Viatura</p>
                    <p>{selectedRelatorio.viaturaPrefixo}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Data de Criação</p>
                    <p>{new Date(selectedRelatorio.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Período de Patrulhamento</p>
                    <p>
                      {new Date(selectedRelatorio.dataInicio).toLocaleString("pt-BR")} até{" "}
                      {new Date(selectedRelatorio.dataFim).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Total de Ocorrências</p>
                    <p>{selectedRelatorio.totalOcorrencias}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Drogas Apreendidas</p>
                    <p>{selectedRelatorio.drogasApreendidas}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Dinheiro Apreendido</p>
                    <p>R$ {selectedRelatorio.dinheiroSujoApreendido}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Armamento</p>
                    <p>{selectedRelatorio.armamentoApreendido}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Munição</p>
                    <p>{selectedRelatorio.municaoApreendida}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Bombas</p>
                    <p>{selectedRelatorio.bombasApreendidas}</p>
                  </div>
                  <div>
                    <p className="text-orange-400 font-semibold">Lockpik</p>
                    <p>{selectedRelatorio.lockpikApreendidas}</p>
                  </div>
                </div>
                {selectedRelatorio.observacoes && (
                  <div>
                    <p className="text-orange-400 font-semibold">Observações</p>
                    <p className="text-sm">{selectedRelatorio.observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black to-orange-900 border-t-4 border-orange-500 py-4 px-4 text-center text-gray-400 text-sm">
        <p>© 2025 3º Batalhão de Polícia de Choque Humaitá - Sistema RSO</p>
      </footer>
    </div>
  );
}
