import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { PATENTES } from "@shared/constants";
import { VIATURAS_FLAT } from "@shared/viaturas";
import { useLocation } from "wouter";
import { CheckCircle2 } from "lucide-react";

const rsoFormSchema = z.object({
  encarregadoNome: z.string().min(1, "Nome é obrigatório"),
  encarregadoSobrenome: z.string().min(1, "Sobrenome é obrigatório"),
  encarregadoPatente: z.string().min(1, "Patente é obrigatória"),
  viaturaPrefixo: z.string().min(1, "Prefixo da viatura é obrigatório"),
  chefeBarcaPatente: z.string().min(1, "Patente do chefe de barca é obrigatória"),
  chefeBarcaNome: z.string().min(1, "Nome do chefe de barca é obrigatório"),
  motoristaPatente: z.string().min(1, "Patente do motorista é obrigatória"),
  motoristaNome: z.string().min(1, "Nome do motorista é obrigatório"),
  terceirohomemPatente: z.string().min(1, "Patente do 3º homem é obrigatória"),
  terceirohomemNome: z.string().min(1, "Nome do 3º homem é obrigatório"),
  quartohomemPatente: z.string().min(1, "Patente do 4º homem é obrigatória"),
  quartohomemNome: z.string().min(1, "Nome do 4º homem é obrigatório"),
  quintohomemPatente: z.string().min(1, "Patente do 5º homem é obrigatória"),
  quintohomemNome: z.string().min(1, "Nome do 5º homem é obrigatório"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  horarioInicio: z.string().min(1, "Horário de início é obrigatório"),
  dataFim: z.string().min(1, "Data de fim é obrigatória"),
  horarioFim: z.string().min(1, "Horário de fim é obrigatório"),
  totalOcorrencias: z.coerce.number().int().nonnegative().default(0),
  drogasApreendidas: z.coerce.number().int().nonnegative().default(0),
  dinheiroSujoApreendido: z.coerce.number().nonnegative().default(0),
  armamentoApreendido: z.coerce.number().int().nonnegative().default(0),
  municaoApreendida: z.coerce.number().int().nonnegative().default(0),
  bombasApreendidas: z.coerce.number().int().nonnegative().default(0),
  lockpikApreendidas: z.coerce.number().int().nonnegative().default(0),
  relacaoDetidosBos: z.string().optional(),
  acoesRealizadas: z.string().optional(),
  observacoes: z.string().optional(),
});

type RSOFormData = z.infer<typeof rsoFormSchema>;

export default function RSOForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [, setLocation] = useLocation();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<RSOFormData>({
    resolver: zodResolver(rsoFormSchema) as any,
    defaultValues: {
      totalOcorrencias: 0,
      drogasApreendidas: 0,
      dinheiroSujoApreendido: 0,
      armamentoApreendido: 0,
      municaoApreendida: 0,
      bombasApreendidas: 0,
      lockpikApreendidas: 0,
    },
  });

  const createRSOMutation = trpc.rso.create.useMutation();

  const onSubmit = async (data: RSOFormData) => {
    setIsSubmitting(true);
    try {
      const [horaInicio, minutoInicio] = data.horarioInicio.split(":").map(Number);
      const [horaFim, minutoFim] = data.horarioFim.split(":").map(Number);

      const dataInicio = new Date(data.dataInicio);
      dataInicio.setHours(horaInicio, minutoInicio);

      const dataFim = new Date(data.dataFim);
      dataFim.setHours(horaFim, minutoFim);

      await createRSOMutation.mutateAsync({
        encarregadoNome: data.encarregadoNome,
        encarregadoSobrenome: data.encarregadoSobrenome,
        encarregadoPatente: data.encarregadoPatente,
        viaturaPrefixo: data.viaturaPrefixo,
        chefeBarcaPatente: data.chefeBarcaPatente,
        chefeBarcaNome: data.chefeBarcaNome,
        motoristaPatente: data.motoristaPatente,
        motoristaNome: data.motoristaNome,
        terceirohomemPatente: data.terceirohomemPatente,
        terceirohomemNome: data.terceirohomemNome,
        quartohomemPatente: data.quartohomemPatente,
        quartohomemNome: data.quartohomemNome,
        quintohomemPatente: data.quintohomemPatente,
        quintohomemNome: data.quintohomemNome,
        dataInicio,
        dataFim,
        totalOcorrencias: data.totalOcorrencias,
        drogasApreendidas: data.drogasApreendidas,
        dinheiroSujoApreendido: data.dinheiroSujoApreendido,
        armamentoApreendido: data.armamentoApreendido,
        municaoApreendida: data.municaoApreendida,
        bombasApreendidas: data.bombasApreendidas,
        lockpikApreendidas: data.lockpikApreendidas,
        relacaoDetidosBos: data.relacaoDetidosBos,
        acoesRealizadas: data.acoesRealizadas,
        observacoes: data.observacoes,
      });

      setShowSuccess(true);
      reset();
      setStep(1);

      setTimeout(() => {
        setShowSuccess(false);
        setLocation("/");
      }, 3000);
    } catch (error) {
      toast.error("Erro ao enviar relatório. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      // Validar apenas os campos da etapa atual antes de avançar
      handleSubmit((data: RSOFormData) => {
        setStep(step + 1);
      })(e);
    } else {
      // Na última etapa, validar e enviar
      handleSubmit((data: RSOFormData) => {
        onSubmit(data);
      })(e);
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-24 h-24 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-500">Relatório Enviado!</h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Seu Relatório de Serviço Operacional foi enviado com sucesso.
          </p>
          <p className="text-gray-400 text-sm md:text-base">
            Redirecionando para a página inicial...
          </p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 control={control} errors={errors} />;
      case 2:
        return <Step2 control={control} errors={errors} />;
      case 3:
        return <Step3 control={control} errors={errors} />;
      case 4:
        return <Step4 control={control} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header com Logo */}
      <header className="bg-gradient-to-r from-black to-orange-900 border-b-4 border-orange-500 py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <img src="/brasao.png" alt="Brasão 3º BPChq Humaitá" className="h-12 md:h-16 w-12 md:w-16 object-contain" />
            <div className="min-w-0">
              <h1 className="text-xl md:text-3xl font-bold text-orange-500 truncate">Sistema RSO</h1>
              <p className="text-orange-400 text-xs md:text-sm truncate">3º Batalhão de Polícia de Choque Humaitá</p>
            </div>
          </div>
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black text-xs md:text-sm whitespace-nowrap"
          >
            ← Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto py-6 md:py-8 px-4 w-full">
        <Card className="bg-gray-900 border-2 border-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardTitle className="text-xl md:text-2xl">Relatório de Serviço Operacional (RSO)</CardTitle>
            <CardDescription className="text-orange-100 text-xs md:text-sm">
              3º Batalhão de Polícia de Choque Humaitá
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Indicador de Passo */}
            <div className="mb-8">
              <div className="flex justify-between items-center gap-1 md:gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors text-xs md:text-base flex-shrink-0 ${
                        s <= step ? "bg-orange-600" : "bg-gray-700"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 4 && (
                      <div
                        className={`h-1 flex-1 mx-1 md:mx-2 transition-colors ${
                          s < step ? "bg-orange-600" : "bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs md:text-sm text-orange-400">
                Passo {step} de 4
              </div>
            </div>

            {/* Conteúdo do Passo */}
            <form onSubmit={handleFormSubmit}>
              {renderStep()}

              {/* Botões de Navegação */}
              <div className="flex gap-2 md:gap-4 mt-8 flex-col-reverse md:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black flex-1"
                >
                  ← Anterior
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 ${
                    step < 4
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? "Enviando..." : step < 4 ? "Próximo →" : "Enviar Relatório"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black to-orange-900 border-t-4 border-orange-500 mt-12 py-6 px-4 text-center text-gray-400 text-xs md:text-sm">
        <p>© 2025 3º Batalhão de Polícia de Choque Humaitá - Sistema RSO</p>
      </footer>
    </div>
  );
}

function Step1({ control, errors }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-base md:text-lg font-semibold text-orange-400">Informações do Policial Encarregado</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="encarregadoNome" className="text-gray-300 text-sm md:text-base">Nome</Label>
          <Controller
            name="encarregadoNome"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="encarregadoNome"
                placeholder="Digite o nome"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
              />
            )}
          />
          {errors.encarregadoNome && (
            <span className="text-xs md:text-sm text-red-500">{errors.encarregadoNome.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="encarregadoSobrenome" className="text-gray-300 text-sm md:text-base">Sobrenome</Label>
          <Controller
            name="encarregadoSobrenome"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="encarregadoSobrenome"
                placeholder="Digite o sobrenome"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
              />
            )}
          />
          {errors.encarregadoSobrenome && (
            <span className="text-xs md:text-sm text-red-500">{errors.encarregadoSobrenome.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="encarregadoPatente" className="text-gray-300 text-sm md:text-base">Patente</Label>
          <Controller
            name="encarregadoPatente"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm md:text-base">
                  <SelectValue placeholder="Selecione a patente" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {PATENTES.map((patente) => (
                    <SelectItem key={patente} value={patente} className="text-white text-sm md:text-base">
                      <span className="flex items-center gap-2">
                        <img src="/brasao.png" alt="Brasão" className="w-4 h-4" />
                        {patente}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.encarregadoPatente && (
            <span className="text-xs md:text-sm text-red-500">{errors.encarregadoPatente.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Step2({ control, errors }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-base md:text-lg font-semibold text-orange-400">Informações da Viatura e Equipe</h3>

      <div>
        <Label htmlFor="viaturaPrefixo" className="text-gray-300 text-sm md:text-base">Prefixo da Viatura</Label>
        <Controller
          name="viaturaPrefixo"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm md:text-base">
                <SelectValue placeholder="Selecione o prefixo da viatura" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {VIATURAS_FLAT.map((viatura) => (
                  <SelectItem key={viatura} value={viatura} className="text-white text-sm md:text-base">
                    <span className="flex items-center gap-2">
                      <img src="/brasao.png" alt="Brasão" className="w-4 h-4" />
                      {viatura}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.viaturaPrefixo && (
          <span className="text-xs md:text-sm text-red-500">{errors.viaturaPrefixo.message}</span>
        )}
      </div>

      {/* Chefe de Barca */}
      <div className="border-t border-gray-700 pt-4">
        <h4 className="font-semibold text-orange-300 mb-3 text-sm md:text-base">Chefe de Barca</h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="chefeBarcaPatente" className="text-gray-300 text-sm md:text-base">Patente</Label>
            <Controller
              name="chefeBarcaPatente"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm md:text-base">
                    <SelectValue placeholder="Patente" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {PATENTES.map((patente) => (
                      <SelectItem key={patente} value={patente} className="text-white text-sm md:text-base">
                        <span className="flex items-center gap-2">
                          <img src="/brasao.png" alt="Brasão" className="w-4 h-4" />
                          {patente}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="chefeBarcaNome" className="text-gray-300 text-sm md:text-base">Nome</Label>
            <Controller
              name="chefeBarcaNome"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="chefeBarcaNome"
                  placeholder="Nome"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Motorista */}
      <div className="border-t border-gray-700 pt-4">
        <h4 className="font-semibold text-orange-300 mb-3 text-sm md:text-base">Motorista</h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="motoristaPatente" className="text-gray-300 text-sm md:text-base">Patente</Label>
            <Controller
              name="motoristaPatente"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm md:text-base">
                    <SelectValue placeholder="Patente" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {PATENTES.map((patente) => (
                      <SelectItem key={patente} value={patente} className="text-white text-sm md:text-base">
                        <span className="flex items-center gap-2">
                          <img src="/brasao.png" alt="Brasão" className="w-4 h-4" />
                          {patente}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="motoristaNome" className="text-gray-300 text-sm md:text-base">Nome</Label>
            <Controller
              name="motoristaNome"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="motoristaNome"
                  placeholder="Nome"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* 3º Homem */}
      <div className="border-t border-gray-700 pt-4">
        <h4 className="font-semibold text-orange-300 mb-3 text-sm md:text-base">3º Homem</h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="terceirohomemPatente" className="text-gray-300 text-sm md:text-base">Patente</Label>
            <Controller
              name="terceirohomemPatente"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm md:text-base">
                    <SelectValue placeholder="Patente" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {PATENTES.map((patente) => (
                      <SelectItem key={patente} value={patente} className="text-white text-sm md:text-base">
                        <span className="flex items-center gap-2">
                          <img src="/brasao.png" alt="Brasão" className="w-4 h-4" />
                          {patente}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="terceirohomemNome" className="text-gray-300 text-sm md:text-base">Nome</Label>
            <Controller
              name="terceirohomemNome"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="terceirohomemNome"
                  placeholder="Nome"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* 4º Homem */}
      <div className="border-t border-gray-700 pt-4">
        <h4 className="font-semibold text-orange-300 mb-3 text-sm md:text-base">4º Homem</h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="quartohomemPatente" className="text-gray-300 text-sm md:text-base">Patente</Label>
            <Controller
              name="quartohomemPatente"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm md:text-base">
                    <SelectValue placeholder="Patente" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {PATENTES.map((patente) => (
                      <SelectItem key={patente} value={patente} className="text-white text-sm md:text-base">
                        <span className="flex items-center gap-2">
                          <img src="/brasao.png" alt="Brasão" className="w-4 h-4" />
                          {patente}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="quartohomemNome" className="text-gray-300 text-sm md:text-base">Nome</Label>
            <Controller
              name="quartohomemNome"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="quartohomemNome"
                  placeholder="Nome"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* 5º Homem */}
      <div className="border-t border-gray-700 pt-4">
        <h4 className="font-semibold text-orange-300 mb-3 text-sm md:text-base">5º Homem</h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="quintohomemPatente" className="text-gray-300 text-sm md:text-base">Patente</Label>
            <Controller
              name="quintohomemPatente"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white text-sm md:text-base">
                    <SelectValue placeholder="Patente" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {PATENTES.map((patente) => (
                      <SelectItem key={patente} value={patente} className="text-white text-sm md:text-base">
                        <span className="flex items-center gap-2">
                          <img src="/brasao.png" alt="Brasão" className="w-4 h-4" />
                          {patente}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="quintohomemNome" className="text-gray-300 text-sm md:text-base">Nome</Label>
            <Controller
              name="quintohomemNome"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="quintohomemNome"
                  placeholder="Nome"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3({ control, errors }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-base md:text-lg font-semibold text-orange-400">Data e Horário de Patrulhamento</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="dataInicio" className="text-gray-300 text-sm md:text-base">Data de Início</Label>
          <Controller
            name="dataInicio"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="dataInicio"
                type="date"
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
          {errors.dataInicio && (
            <span className="text-xs md:text-sm text-red-500">{errors.dataInicio.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="horarioInicio" className="text-gray-300 text-sm md:text-base">Horário de Início</Label>
          <Controller
            name="horarioInicio"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="horarioInicio"
                type="time"
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
          {errors.horarioInicio && (
            <span className="text-xs md:text-sm text-red-500">{errors.horarioInicio.message}</span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 space-y-4">
        <div>
          <Label htmlFor="dataFim" className="text-gray-300 text-sm md:text-base">Data de Finalização</Label>
          <Controller
            name="dataFim"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="dataFim"
                type="date"
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
          {errors.dataFim && (
            <span className="text-xs md:text-sm text-red-500">{errors.dataFim.message}</span>
          )}
        </div>

        <div>
          <Label htmlFor="horarioFim" className="text-gray-300 text-sm md:text-base">Horário de Finalização</Label>
          <Controller
            name="horarioFim"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="horarioFim"
                type="time"
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
          {errors.horarioFim && (
            <span className="text-xs md:text-sm text-red-500">{errors.horarioFim.message}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Step4({ control, errors }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-base md:text-lg font-semibold text-orange-400">Dados de Patrulhamento</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="totalOcorrencias" className="text-gray-300 text-sm md:text-base">Total de Ocorrências Atendidas</Label>
          <Controller
            name="totalOcorrencias"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="totalOcorrencias"
                type="number"
                min="0"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="drogasApreendidas" className="text-gray-300 text-sm md:text-base">Drogas Apreendidas (quantidade)</Label>
          <Controller
            name="drogasApreendidas"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="drogasApreendidas"
                type="number"
                min="0"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="dinheiroSujoApreendido" className="text-gray-300 text-sm md:text-base">Dinheiro Sujo Apreendido (R$)</Label>
          <Controller
            name="dinheiroSujoApreendido"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="dinheiroSujoApreendido"
                type="number"
                min="0"
                step="0.01"
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="armamentoApreendido" className="text-gray-300 text-sm md:text-base">Armamento Apreendido (quantidade)</Label>
          <Controller
            name="armamentoApreendido"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="armamentoApreendido"
                type="number"
                min="0"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="municaoApreendida" className="text-gray-300 text-sm md:text-base">Munição Apreendida (quantidade)</Label>
          <Controller
            name="municaoApreendida"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="municaoApreendida"
                type="number"
                min="0"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="bombasApreendidas" className="text-gray-300 text-sm md:text-base">Bombas Apreendidas (quantidade)</Label>
          <Controller
            name="bombasApreendidas"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="bombasApreendidas"
                type="number"
                min="0"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="lockpikApreendidas" className="text-gray-300 text-sm md:text-base">Lockpik Apreendidas (quantidade)</Label>
          <Controller
            name="lockpikApreendidas"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="lockpikApreendidas"
                type="number"
                min="0"
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white text-sm md:text-base"
              />
            )}
          />
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 space-y-4">
        <div>
          <Label htmlFor="relacaoDetidosBos" className="text-gray-300 text-sm md:text-base">Relação de Detidos e B.Os</Label>
          <Controller
            name="relacaoDetidosBos"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="relacaoDetidosBos"
                placeholder="Descreva a relação de detidos e boletins de ocorrência"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="acoesRealizadas" className="text-gray-300 text-sm md:text-base">Ações Realizadas pela Equipe</Label>
          <Controller
            name="acoesRealizadas"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="acoesRealizadas"
                placeholder="Descreva as ações realizadas pela equipe"
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="observacoes" className="text-gray-300 text-sm md:text-base">
            Observações (Modelo de armamento apreendido, Tipo de droga apreendida)
          </Label>
          <Controller
            name="observacoes"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="observacoes"
                placeholder="Ex: Armamento - Pistola 9mm, Revólver .38 | Drogas - Cocaína, Maconha"
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 text-sm md:text-base"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
