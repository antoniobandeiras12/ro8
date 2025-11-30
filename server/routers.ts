import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import { createRelatorio, getRelatorios, getRelatorioById, updateRelatorio, deleteRelatorio } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  rso: router({
    create: publicProcedure
      .input(z.object({
        encarregadoNome: z.string().min(1),
        encarregadoSobrenome: z.string().min(1),
        encarregadoPatente: z.string().min(1),
        viaturaPrefixo: z.string().min(1),
        chefeBarcaPatente: z.string().min(1),
        chefeBarcaNome: z.string().min(1),
        motoristaPatente: z.string().min(1),
        motoristaNome: z.string().min(1),
        terceirohomemPatente: z.string().min(1),
        terceirohomemNome: z.string().min(1),
        quartohomemPatente: z.string().min(1),
        quartohomemNome: z.string().min(1),
        quintohomemPatente: z.string().min(1),
        quintohomemNome: z.string().min(1),
        dataInicio: z.date(),
        dataFim: z.date(),
        totalOcorrencias: z.number().int().nonnegative().default(0),
        drogasApreendidas: z.number().int().nonnegative().default(0),
        dinheiroSujoApreendido: z.number().nonnegative().default(0),
        armamentoApreendido: z.number().int().nonnegative().default(0),
        municaoApreendida: z.number().int().nonnegative().default(0),
        bombasApreendidas: z.number().int().nonnegative().default(0),
        lockpikApreendidas: z.number().int().nonnegative().default(0),
        relacaoDetidosBos: z.string().optional(),
        acoesRealizadas: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createRelatorio(input);
      }),

    list: publicProcedure
      .query(async () => {
        console.log("[tRPC] rso.list query called");
        try {
          const relatorios = await getRelatorios();
          console.log("[tRPC] rso.list returning", relatorios.length, "relatorios");
          return relatorios;
        } catch (error) {
          console.error("[tRPC] Error in rso.list:", error);
          throw error;
        }
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number().int() }))
      .query(async ({ input }) => {
        return await getRelatorioById(input.id);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number().int(),
        data: z.object({
          encarregadoNome: z.string().optional(),
          encarregadoSobrenome: z.string().optional(),
          encarregadoPatente: z.string().optional(),
          viaturaPrefixo: z.string().optional(),
          chefeBarcaPatente: z.string().optional(),
          chefeBarcaNome: z.string().optional(),
          motoristaPatente: z.string().optional(),
          motoristaNome: z.string().optional(),
          terceirohomemPatente: z.string().optional(),
          terceirohomemNome: z.string().optional(),
          quartohomemPatente: z.string().optional(),
          quartohomemNome: z.string().optional(),
          quintohomemPatente: z.string().optional(),
          quintohomemNome: z.string().optional(),
          dataInicio: z.date().optional(),
          dataFim: z.date().optional(),
          totalOcorrencias: z.number().int().nonnegative().optional(),
          drogasApreendidas: z.number().int().nonnegative().optional(),
          dinheiroSujoApreendido: z.number().nonnegative().optional(),
          armamentoApreendido: z.number().int().nonnegative().optional(),
          municaoApreendida: z.number().int().nonnegative().optional(),
          bombasApreendidas: z.number().int().nonnegative().optional(),
          lockpikApreendidas: z.number().int().nonnegative().optional(),
          relacaoDetidosBos: z.string().optional(),
          acoesRealizadas: z.string().optional(),
          observacoes: z.string().optional(),
        }).partial(),
      }))
      .mutation(async ({ input }) => {
        await updateRelatorio(input.id, input.data);
        return { success: true };
      }),


  }),
});

export type AppRouter = typeof appRouter;
