# Sistema RSO - 3º BPChq Humaitá - TODO

## Funcionalidades Principais

### Banco de Dados e Schema
- [x] Criar tabela de relatórios (RSO) com todos os campos especificados
- [ ] Criar tabela de viaturas com prefixos
- [x] Criar tabela de patentes (enum)
- [x] Criar índices e relacionamentos no banco de dados
- [x] Implementar migrações com Drizzle ORM

### Formulário de Envio de RSO (4 Passos)
- [x] **Passo 1:** Informações do policial encarregado (Nome, Sobrenome, Patente)
- [x] **Passo 2:** Informações da viatura e equipe (Prefixo, Chefe de Barca, Motorista, 3º/4º/5º Homem)
- [x] **Passo 3:** Data e horário de patrulhamento (Início e Fim)
- [x] **Passo 4:** Dados de patrulhamento (Ocorrências, Apreensões, Detidos, Observações)
- [x] Implementar validação de formulário com Zod
- [x] Implementar salvamento dos dados no banco de dados
- [x] Implementar botão de envio de relatório

### Área de Administração
- [x] Criar página de login/autenticação para admin
- [x] Criar dashboard de admin com listagem de relatórios
- [x] Implementar filtros de busca (por data, viatura, policial, etc.)
- [x] Implementar visualização detalhada de cada relatório
- [ ] Implementar edição de relatórios
- [x] Implementar exclusão de relatórios

### Exportação de Dados
- [x] Implementar exportação para CSV
- [x] Implementar exportação para TXT (bloco de notas)
- [x] Implementar exportação para Excel (.xlsx)
- [x] Adicionar opções de filtro antes de exportar

### Interface de Usuário
- [ ] Criar layout responsivo para formulário de RSO
- [ ] Criar layout de dashboard para admin
- [ ] Implementar navegação entre passos do formulário
- [ ] Implementar confirmação antes de enviar relatório
- [ ] Adicionar mensagens de sucesso/erro
- [ ] Estilizar com Tailwind CSS 4

### Testes
- [ ] Escrever testes Vitest para procedures de RSO
- [ ] Escrever testes para autenticação de admin
- [ ] Escrever testes para exportação de dados

### Deployment
- [ ] Criar checkpoint antes de publicar
- [ ] Publicar projeto

## Notas
- Aguardando lista de prefixos das viaturas do usuário
- Patentes predefinidas: Tenente Coronel, Major, Capitão, 1º Tenente, 2º Tenente, Aspirante a Oficial, Subtenente, 1º Sargento, 2º Sargento, 3º Sargento, Cabo, Soldado 1ª Classe, Soldado 2ª Classe
- Acesso restrito: Apenas o usuário (dono) e o encarregado de RH podem acessar a área de admin


### Redesign com Cores do Brasão
- [x] Copiar logo do brasão para pasta public
- [x] Adicionar logo no cabeçalho das páginas
- [x] Alterar cores para preto e laranja (cores do batal hão)
- [x] Remover página de login (acesso direto)
- [x] Remover informações do usuário do rodapé
- [x] Formulário RSO sem login (público)
- [x] Admin com login + verificação de domínio/slug
- [x] Atualizar tema global com cores do brasão


### Ajustes Finais
- [x] Remover acesso admin da página inicial
- [x] Implementar login simples (Admin / 24032005)
- [x] Criar rota de admin com SLUG específico
- [x] Tornar formulário responsivo para mobile
- [x] Campos de formulário um abaixo do outro
- [x] Data e hora um abaixo do outro
- [x] Adicionar título nas observações com exemplos
- [x] Adicionar ícone brasão ao lado de patentes e prefixos
- [x] Corrigir erro de envio do formulário


### Correções e Melhorias de UI
- [x] Corrigir erro de envio do formulário RSO
- [x] Adicionar animação de sucesso no envio
- [x] Mover ícone brasão para dentro do menu de patentes
- [x] Mover ícone brasão para dentro do menu de prefixos
- [x] Remover card de informações da home
- [x] Centralizar card de envio na home
- [x] Adicionar rodapé na página inicial


### Correções Finais
- [x] Corrigir envio automático ao chegar na etapa 4
- [x] Integrar prefixos das viaturas (TRAIL 23, TRAIL 21, SPIN)


### Debug e Correção
- [x] Verificar por que relatórios não aparecem no painel de admin
- [x] Debugar procedure de listagem (rso.list)
- [x] Verificar se dados estão sendo salvos no banco de dados
- [x] Remover funcionalidade de deletar relatórios (devem ser permanentes)
- [x] Corrigir autenticação/autorização do admin
