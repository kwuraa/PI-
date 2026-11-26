# 03 — As 25 telas

Uma seção por área. Em cada tela: **rota**, **arquivo**, o que ela mostra e
os **prints** de referência em [`prints/`](../prints) (há `desktop/` e
`mobile/` por persona).

> **Privacidade (LGPD):** em vistas públicas a equipe aparece só como
> `Equipe DSM — Xº Semestre` (`teamDisplay(project, { publicView: true })`).
> O nome dos integrantes só aparece para usuário logado.

---

## Visitante — `src/pages/public/`

### Boas-vindas — `/` → `WelcomePage.jsx`

Hero institucional + **vitrine pública**: campo de busca, seletor de semestre
e cards de projeto. Apenas projetos **publicados** aparecem para o visitante.

- Print: `01-visitante/desktop/01-boas-vindas.png`

### Login — `/login` → `LoginPage.jsx`

Acesso com **3 perfis de acesso rápido** (Aluno, Professor e Coordenador —
recurso didático para o avaliador) ou e-mail/senha. A Secretaria (Helena
Souza) entra pelo formulário, sem card de atalho. Também há o formulário de e-mail/senha convencional.

- Print: `01-visitante/desktop/02-login.png`

### Cadastro — `/cadastro` → `SignupPage.jsx`

Cadastro institucional com **curso travado em DSM**.

- Print: `01-visitante/desktop/03-cadastro.png`

### Recuperação de senha — `/recuperar-senha` → `RecoveryPage.jsx`

Fluxo de recuperação **simulado** (nenhum e-mail é enviado).

- Print: `01-visitante/desktop/04-recuperar-senha.png`

### Termos de uso — `/termos` → `TermsPage.jsx`

Página legal construída sobre o componente compartilhado `LegalPage`.

- Print: `01-visitante/desktop/05-termos.png`

### Política de privacidade — `/privacidade` → `PrivacyPage.jsx`

LGPD e tratamento de dados, também via `LegalPage`.

- Print: `01-visitante/desktop/06-privacidade.png`

---

## Raiz (logado e público) — `src/pages/`

### Explorar — `/explorar` → `ExplorePage.jsx`

Busca + **filtros em bottom sheet** + resultado em cards. Compartilha o
mesmo motor de filtros da vitrine.

- Print: `01-visitante/desktop/07-explorar.png`, `01-visitante/desktop/08-explorar-filtros.png`

### Detalhe do projeto — `/projeto/:slug` → `ProjectPage.jsx`

A tela mais completa. Duas variantes conforme o acesso:

| Visitante (público)        | Logado                                  |
| -------------------------- | --------------------------------------- |
| Hero, descrição, destaques | idem + equipe com nomes                 |
| Só o link navegável + docs | os 3 links (GitHub, Live, Docs)         |
| Curtir / contagem          | curtir, editar equipe, ações            |
| Comentários visíveis       | comentários com permissão de escrever   |
| —                          | arquivos internos, histórico de revisão |

Estrutura interna: `ProjectSidebar` (coluna direita sticky: pílulas de status,
card **Engajamento** (views/curtidas), equipe e arquivos) e
`ProjectComments` (todo o estado de comentários: enviar, editar, excluir com
confirmação, moderação).

- Print: `01-visitante/desktop/09-projeto-publico.png`, `02-aluno/desktop/05-projeto-logado.png`

### Ajuda — `/ajuda` → `HelpPage.jsx`

Central de ajuda com busca e artigos.

- Print: `01-visitante/desktop/10-ajuda.png`

### Perfil — `/perfil` → `ProfilePage.jsx`

Dados da conta, notificações, **Espaço ativo** (seletor de papel, quando o
usuário tem mais de um) e logout.

- Print: `02-aluno/desktop/06-perfil.png`, `03-professor/desktop/09-perfil.png`,
  `04-coordenador/desktop/07-perfil.png`, `05-secretaria/desktop/03-perfil.png`

### Alterar senha — `/alterar-senha` → `ChangePasswordPage.jsx`

Troca de senha da conta (validação simulada).

- Print: `02-aluno/desktop/07-alterar-senha.png`

### Não encontrado — `*` → `NotFoundPage.jsx`

404 com retorno para a vitrine.

- Print: `01-visitante/desktop/11-404.png`

---

## Aluno — `src/pages/aluno/`

### Meus projetos — `/aluno` → `MyProjectsPage.jsx`

Lista dos projetos do aluno com **status**, ações e atalhos para publicar.

- Print: `02-aluno/desktop/01-meus-projetos.png`

### Novo projeto — `/aluno/novo` → `NewProjectPage.jsx`

Publicação com **3 links obrigatórios**: GitHub, Live Preview e Docs.

- Print: `02-aluno/desktop/02-novo-projeto.png`

### Status da análise — `/aluno/status/:slug` → `ProjectStatusPage.jsx`

Acompanhamento em **etapas qualitativas**. Tem dois estados mutuamente
exclusivos (por isso a página tem 2 `<h1>`, um em cada ramo de render):
**enviado para análise** (sucesso) e **status do projeto** (normal).

- Print: `02-aluno/desktop/03-status-analise.png`, `02-aluno/desktop/04-status-enviado.png`

---

## Equipe — `src/pages/staff/`

### Painel — `/painel` → `StaffPanelPage.jsx`

**Entrada única** que escolhe a _face_ conforme o **Espaço ativo**:

| Espaço                  | Face                          | Componente                  |
| ----------------------- | ----------------------------- | --------------------------- |
| só professor            | Painel do professor           | `staff/ProfessorFace.jsx`   |
| só coordenador          | Painel do coordenador         | `staff/CoordinatorFace.jsx` |
| professor + coordenador | Painel **unificado** com abas | `staff/UnifiedFace.jsx`     |

- **Professor**: saudação, métricas **clicáveis** (revisão abre o
  próximo projeto da fila; orientações rolam até a seção), fila
  "Aguardando revisão" em 2 colunas no desktop e card-resumo da primeira
  orientação.
- **Coordenador**: saudação, métricas do curso, alerta "Grupo sem
  link de documentação" e as "Áreas da coordenação" (relatório consolidado e
  gestão de grupos) em 2 colunas no desktop.
- **Unificado**: abas **Painel unificado | Atalhos** (a aba
  Atalhos tem `h1` próprio), seções "Como professor" e "Como coordenador"
  lado a lado, card único com as métricas do coordenador e o alerta.

Os números vêm de `staffMetrics.js` (derivado dos mocks) — nada fixo.

- Print: `03-professor/desktop/01-painel.png`, `04-coordenador/desktop/01-painel.png`

### Fila de entregas — `/painel/entregas` → `DeliveriesPage.jsx`

Trabalhos enviados com **filtros** e busca; estado vazio usa o bloco
`staff/CalloutNotFound`.

- Print: `03-professor/desktop/02-entregas.png`, `04-coordenador/desktop/05-entregas.png`

### Detalhe da entrega — `/painel/entrega/:slug` → `DeliveryPage.jsx`

Detalhe da entrega + **upload de evidências** (simulado).

- Print: `03-professor/desktop/03-entrega-detalhe.png`, `04-coordenador/desktop/06-entrega-detalhe.png`

### Revisar projeto — `/painel/revisar/:slug` → `ReviewPage.jsx`

Revisão com **checklist de critérios qualitativos** e emissão de parecer.

- Print: `03-professor/desktop/04-revisar.png`

### Resultado da análise — `/painel/resultado/:slug` → `ReviewResultPage.jsx`

Desfecho da revisão: **aprovado** ou **ajustes solicitados**
(`?decisao=ajustes`). Dois estados distintos.

- Print: `03-professor/desktop/05-resultado-aprovado.png`,
  `03-professor/desktop/06-resultado-ajustes.png`

### Relatório por projeto — `/painel/evolucao` → `EvolutionPage.jsx`

Relatório qualitativo de cada projeto de PI sob orientação do professor
logado. O seletor lista os projetos cadastrados para ele; ao trocar a seleção,
o histórico (envio, parecer e desfecho), a evolução qualitativa e os documentos
do projeto selecionado são atualizados. A exportação abre a impressão do
navegador (`window.print()`). A folha impressa ainda não replica os cards nem
apresenta o relatório formatado: sai **apenas um aviso** de que a formatação
institucional será implementada mais tarde, quando o template oficial com a
identidade da instituição e o timbre da FATEC for fornecido
(`ProjectReportSheet.jsx`). A página já está preparada em ABNT: A4, margens
3/2 cm, Times New Roman 12 pt, entrelinha 1,5, recuo de 1,25 cm e numeração de
página. O cabeçalho institucional aparece só na tela; instruções para o timbre
em [`07-impressao-abnt.md`](07-impressao-abnt.md).

- Print: `03-professor/desktop/07-evolucao.png`, `04-coordenador/desktop/04-evolucao.png`

### Gestão de grupos — `/painel/grupos` → `GroupsPage.jsx`

Exclusiva da **coordenação**: lista de grupos + **link de documentação**
(é a tela para resolver o alerta do painel).

- Print: `04-coordenador/desktop/02-grupos.png`

### Relatório consolidado — `/painel/relatorio-consolidado` → `RelatorioConsolidadoPage.jsx`

**Uma rota, duas faces** (mesmo padrão do painel), escolhidas pelo papel:

| Papel                       | Face                         | Componente                 |
| --------------------------- | ---------------------------- | -------------------------- |
| só coordenador              | Face do **semestre vigente** | `staff/SemesterReport.jsx` |
| coordenador **+** professor | Face da **coorte**           | `staff/CohortReport.jsx`   |

- **Semestre**: seletor do semestre, 4 `StatCard` (Grupos ativos · Alunos
  participantes · Média dos projetos · Entregas concluídas), card
  "Acompanhamento geral" com barras de progresso e card "Projetos no
  semestre" + botão _Ver pendências dos grupos_.
- **Coorte**: seletor "Coorte · data de ingresso", 2 `StatCard`, gráfico
  "Evolução por semestre", cards "Travas de disciplinas" e "Banca e
  entregáveis" e a nota de consolidação.
- Print: `04-coordenador/desktop/03-relatorio-consolidado.png`

### Meu projeto e materiais — `/painel/meu-projeto` → `ProfessorProjectPage.jsx`

Lista **todos** os projetos sob orientação do professor, com **um
`ProjectBlock` por projeto** (`staff/ProjectBlock.jsx`): pills (DSM + status),
título, meta, equipe e orientador, ação coerente com o status, cards "Sobre o
projeto" e "Meus documentos", callout de privacidade e a coluna sticky
"Links do projeto" com a nota de aprovação.

Ação por status:

| Status       | Ação                     | Destino                   |
| ------------ | ------------------------ | ------------------------- |
| `publicado`  | Ver projeto              | `/projeto/:slug`          |
| `em-analise` | Revisar projeto          | `/painel/revisar/:slug`   |
| `ajustes`    | Ver resultado da análise | `/painel/resultado/:slug` |
| `rascunho`   | Ver grupo na gestão      | `/painel/grupos`          |

- Print: `03-professor/desktop/08-meu-projeto.png`

---

## Secretaria — `src/pages/secretary/`

### Cursos — `/secretaria/cursos` → `CoursesPage.jsx`

Cadastro e listagem de cursos da instituição, com **modal** de criação.

- Print: `05-secretaria/desktop/01-cursos.png`, `05-secretaria/desktop/02-cursos-modal.png`

---

## Índice por rota

| Rota                            | Arquivo                              | Papel                   |
| ------------------------------- | ------------------------------------ | ----------------------- |
| `/`                             | `public/WelcomePage.jsx`             | visitante               |
| `/login`                        | `public/LoginPage.jsx`               | visitante               |
| `/cadastro`                     | `public/SignupPage.jsx`              | visitante               |
| `/recuperar-senha`              | `public/RecoveryPage.jsx`            | visitante               |
| `/termos`                       | `public/TermsPage.jsx`               | visitante               |
| `/privacidade`                  | `public/PrivacyPage.jsx`             | visitante               |
| `/explorar`                     | `ExplorePage.jsx`                    | todos                   |
| `/projeto/:slug`                | `ProjectPage.jsx`                    | todos                   |
| `/ajuda`                        | `HelpPage.jsx`                       | todos                   |
| `/perfil`                       | `ProfilePage.jsx`                    | logado                  |
| `/alterar-senha`                | `ChangePasswordPage.jsx`             | logado                  |
| `/aluno`                        | `aluno/MyProjectsPage.jsx`           | aluno                   |
| `/aluno/novo`                   | `aluno/NewProjectPage.jsx`           | aluno                   |
| `/aluno/status/:slug`           | `aluno/ProjectStatusPage.jsx`        | aluno                   |
| `/painel`                       | `staff/StaffPanelPage.jsx`           | professor · coordenador |
| `/painel/entregas`              | `staff/DeliveriesPage.jsx`           | professor · coordenador |
| `/painel/evolucao`              | `staff/EvolutionPage.jsx`            | professor · coordenador |
| `/painel/entrega/:slug`         | `staff/DeliveryPage.jsx`             | professor · coordenador |
| `/painel/grupos`                | `staff/GroupsPage.jsx`               | coordenador             |
| `/painel/relatorio-consolidado` | `staff/RelatorioConsolidadoPage.jsx` | coordenador             |
| `/painel/revisar/:slug`         | `staff/ReviewPage.jsx`               | professor               |
| `/painel/resultado/:slug`       | `staff/ReviewResultPage.jsx`         | professor               |
| `/painel/meu-projeto`           | `staff/ProfessorProjectPage.jsx`     | professor               |
| `/secretaria/cursos`            | `secretary/CoursesPage.jsx`          | secretaria              |
| `*`                             | `NotFoundPage.jsx`                   | todos                   |
