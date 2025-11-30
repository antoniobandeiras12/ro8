import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Enum de patentes
const patentes = [
  "Tenente Coronel",
  "Major",
  "Capitão",
  "1º Tenente",
  "2º Tenente",
  "Aspirante a Oficial",
  "Subtenente",
  "1º Sargento",
  "2º Sargento",
  "3º Sargento",
  "Cabo",
  "Soldado 1ª Classe",
  "Soldado 2ª Classe",
] as const;

export type Patente = (typeof patentes)[number];

// Tabela de Relatórios de Serviço Operacional (RSO)
export const relatorios = mysqlTable("relatorios", {
  id: int("id").autoincrement().primaryKey(),
  
  // Passo 1: Informações do policial encarregado
  encarregadoNome: varchar("encarregado_nome", { length: 255 }).notNull(),
  encarregadoSobrenome: varchar("encarregado_sobrenome", { length: 255 }).notNull(),
  encarregadoPatente: varchar("encarregado_patente", { length: 50 }).notNull(),
  
  // Passo 2: Informações da viatura e equipe
  viaturaPrefixo: varchar("viatura_prefixo", { length: 50 }).notNull(),
  chefeBarcaPatente: varchar("chefe_barca_patente", { length: 50 }).notNull(),
  chefeBarcaNome: varchar("chefe_barca_nome", { length: 255 }).notNull(),
  motoristaPatente: varchar("motorista_patente", { length: 50 }).notNull(),
  motoristaNome: varchar("motorista_nome", { length: 255 }).notNull(),
  terceirohomemPatente: varchar("terceiro_homem_patente", { length: 50 }).notNull(),
  terceirohomemNome: varchar("terceiro_homem_nome", { length: 255 }).notNull(),
  quartohomemPatente: varchar("quarto_homem_patente", { length: 50 }).notNull(),
  quartohomemNome: varchar("quarto_homem_nome", { length: 255 }).notNull(),
  quintohomemPatente: varchar("quinto_homem_patente", { length: 50 }).notNull(),
  quintohomemNome: varchar("quinto_homem_nome", { length: 255 }).notNull(),
  
  // Passo 3: Data e horário de patrulhamento
  dataInicio: timestamp("data_inicio").notNull(),
  dataFim: timestamp("data_fim").notNull(),
  
  // Passo 4: Dados de patrulhamento
  totalOcorrencias: int("total_ocorrencias").default(0).notNull(),
  drogasApreendidas: int("drogas_apreendidas").default(0).notNull(),
  dinheiroSujoApreendido: bigint("dinheiro_sujo_apreendido", { mode: "number" }).default(0).notNull(),
  armamentoApreendido: int("armamento_apreendido").default(0).notNull(),
  municaoApreendida: int("municao_apreendida").default(0).notNull(),
  bombasApreendidas: int("bombas_apreendidas").default(0).notNull(),
  lockpikApreendidas: int("lockpik_apreendidas").default(0).notNull(),
  relacaoDetidosBos: text("relacao_detidos_bos"),
  acoesRealizadas: text("acoes_realizadas"),
  observacoes: text("observacoes"),
  
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Relatorio = typeof relatorios.$inferSelect;
export type InsertRelatorio = typeof relatorios.$inferInsert;