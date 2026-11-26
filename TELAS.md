# PI² — Explicação de cada tela

Guia de leitura das **25 telas** do protótipo: rota, arquivo e o que cada uma
exibe. O projeto é um protótipo **sem backend** — todos os dados vêm de
`src/mocks/projectsMock.js` e todas as ações (login, envio, upload, decisão)
são simuladas no estado local.

> **Privacidade (LGPD):** em vistas públicas a equipe aparece anonimizada
> (`Equipe DSM — Xº Semestre`). Nomes de integrantes, pareceres, comentários e
> arquivos só aparecem para usuário logado.

## Índice

- [Rotas e layouts](#rotas-e-layouts)
- [Visitante (páginas públicas)](#visitante-páginas-públicas)
- [Raiz — logado e público](#raiz--logado-e-público)
- [Aluno](#aluno)
- [Professor / Coordenador (painel)](#professor--coordenador-painel)
- [Secretaria](#secretaria)

---

## Rotas e layouts

| Layout         | O que entrega                                                                                | Telas                                                                             |
| -------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------- | ------------------------------------- |
| `PublicLayout` | Shell público sem BottomNav (boas-vindas, login, cadastro, recuperação, termos, privacidade) | 6                                                                                 |
| `MainLayout`   | Área do sistema com **TopBar + breadcrumb + BottomNav/SideNav** persistentes                 | explorar, perfil, alterar senha, ajuda, `/aluno*`, `/painel` (índice), secretaria |
| `StackShell`   | Barra superior **empilhada** com título resolvido a partir da rota (detalhes/fluxos)         | `/projeto/:slug`, `/painel/revisar                                                | resultado | entrega/:slug`, `/painel/meu-projeto` |

Regras de acesso (`RequireRole` + `useAuth`):

- `/aluno*` → apenas `aluno`
- `/painel*` → `professor` | `coordenador`
- `/painel/grupos` e `/painel/relatorio-consolidado` → `coordenador`
- `/secretaria/cursos` → `secretaria`
- `/perfil` e `/alterar-senha` → qualquer usuário logado

As 25 telas são carregadas com `React.lazy` (code splitting por rota) e o
`<Suspense>` mostra o `RouteFallback` enquanto o chunk chega.

---

## Visitante — `src/pages/public/`

### Boas-vindas / Vitrine — `/` → `WelcomePage.jsx`

Hero em 2 colunas: eyebrow "VITRINE PÚBLICA DA COMUNIDADE", título
"Grandes ideias. Conhecimento que transforma." à esquerda; lead + CTAs
("Entrar no Sistema" / "Ver Projetos") à direita. Abaixo, seção
"Explore os projetos DSM" (busca + chips), banner LGPD e grade
"Projetos da comunidade" com cards **anonimizados** (pílula do semestre +
crédito da equipe). Movimento: hero em stagger (framer-motion) e cards em
cascata.

### Login — `/login` → `LoginPage.jsx`

Chaveamento de perfis **simulado**: escolher um card (Aluno, Professor,
Coordenador) preenche o e-mail e define o papel do login — a senha **não é
validada** (protótipo). A Secretaria entra pelo formulário convencional, sem
card de atalho. Ao selecionar, o card reage com animação de pop + check
(keyframes com guarda de `prefers-reduced-motion`). Após entrar, redireciona
para o espaço do perfil (ou para a rota que originou o acesso).

### Cadastro institucional — `/cadastro` → `SignupPage.jsx`

Título "Suas ideias começam aqui.", cards de perfil ("Como você participa da
faculdade?"), seções "Seus dados" (nome, e-mail e — somente no perfil
Aluno — matrícula, curso travado no DSM e período; professor e coordenação
não preenchem dados de estudante) e "Crie sua senha" (senha + confirmação),
consentimento com links, botão "Criar conta de \<perfil\>", aviso "Confirme
seu vínculo institucional!" e rodapé. Mesma animação pop + check do login.
Após criar a conta, o usuário é levado ao login.

### Recuperação de senha — `/recuperar-senha` → `RecoveryPage.jsx`

Título "Vamos recuperar seu acesso.", campo de e-mail, botão "Enviar
instruções", card "Como funciona" (3 passos), alerta de spam e botão
secundário "Voltar para o acesso". Envio simulado: um callout de sucesso
confirma que o link foi enviado para o e-mail institucional (sem backend).

### Termos de uso — `/termos` → `TermsPage.jsx`

Página legal montada no shell compartilhado `LegalPage` (barra com voltar,
tile de documento, seções e botão de volta). Conteúdo mockado: 7 seções
curtas cobrindo aceitação, conta institucional, uso aceitável, propriedade
dos projetos, moderação, LGPD e contato, com link cruzado para a Política de
privacidade.

### Política de privacidade — `/privacidade` → `PrivacyPage.jsx`

Mesma anatomia dos Termos (componente `LegalPage`), com 6 seções alinhadas à
LGPD: dados coletados, finalidade, base legal, compartilhamento, retenção e
direitos do titular, com link de volta para os Termos.

---

## Raiz — logado e público — `src/pages/`

### Explorar projetos — `/explorar` → `ExplorePage.jsx`

**Dois estados**, condicionais à busca/filtros:

- **Padrão** (sem busca e sem filtros): h1 "Ideias de todos. Inspiração para
  você." + saudação, campo de busca e botão "Filtrar projetos", pílula de
  escopo (DSM), banner "CONHECIMENTO SEM FRONTEIRAS" e as seções "Em
  destaque" e "Novas descobertas" com cards.
- **Resultados** (busca/filtros ativos ou "Ver todos"): contagem de
  resultados, pílulas removíveis e grade.

O mesmo botão "Filtrar projetos" abre o **mesmo painel de filtros** (Popover
ancorado na linha de busca, descendo de baixo da busca, sem overlay) com
chips de Semestre, Ordenar por e Status. Visitantes veem apenas projetos
**publicados** com equipe anonimizada; logados veem os nomes (variante
`logged`).

### Detalhe do projeto — `/projeto/:slug` → `ProjectPage.jsx`

Tela mais completa, com **duas leituras**:

- **Visitante** → leitura pública: equipe anonimizada e sem dados sensíveis
  (sem parecer, sem lista de comentários, sem arquivos) — apenas convite
  para entrar no sistema.
- **Logado** → visão completa: nomes da equipe, arquivos, parecer e
  comentários. O dono (aluno) vê o atalho "Acompanhar análise".

Regras:

- **Comentários:** só quem tem cadastro comenta. Cada aluno edita/exclui
  apenas o próprio comentário; professor e coordenador podem excluir qualquer
  comentário (edição de comentários alheios é negada a todos).
- **Engajamento:** abrir a página soma +1 view (uma por sessão); o card
  "Engajamento" mostra views e curtidas. O like é só para projetos
  publicados e usuários logados; a **equipe não curte o próprio projeto** (no
  lugar do botão aparece nota explicativa).

Layout desktop: topo com h1 + linha de meta; banner de capa
quando o projeto tem `image`; mobile empilhado em 1 coluna; desktop ≥1024px
em 2 colunas (coluna esquerda larga com "Sobre o projeto", "Comentários",
parecer e ações; coluna direita ~350px sticky com status, engajamento,
equipe e arquivos).

### Meu perfil e configurações — `/perfil` → `ProfilePage.jsx`

Protótipo "Perfil e configurações de Ana Costa": h1 "Meu perfil" +
subtítulo; no desktop ≥1024px duas colunas — à esquerda cartão de identidade
e card "Dados institucionais" (e-mail e curso travados); à direita cards
"Notificações" e "Conta e privacidade" e botão "Sair da conta". No mobile
tudo se empilha na mesma ordem. Extras: seletor de **espaço ativo** (troca
de perfis simulada) para usuários multiperfil; salvar alterações e logout
simulados. TopBar, breadcrumb e rodapé vêm do `MainLayout`.

### Alterar senha — `/alterar-senha` → `ChangePasswordPage.jsx`

Tela de conta acessada pelo card "Conta e privacidade" do perfil. Segue o
padrão das páginas logadas (badge + h1 + subtítulo), com card de formulário
(senha atual, nova senha e confirmação), dicas de segurança e callout de
sucesso após a troca — tudo simulado. Quem esqueceu a senha atual segue para
`/recuperar-senha` (link abaixo do formulário).

### Ajuda e suporte — `/ajuda` → `HelpPage.jsx`

Central de dúvidas dentro do `MainLayout`: badge "Ajuda e suporte" + h1 +
subtítulo; seção "Fale com o suporte" (2 cards de contato em grade
responsiva); seção "Perguntas frequentes" com 4 itens `<details>/<summary>`
nativos (abrem sem JavaScript); link final de volta à vitrine pública
(`/explorar`).

### Página não encontrada — `*` → `NotFoundPage.jsx`

Estado vazio didático com atalhos de volta para os espaços principais.

---

## Aluno — `src/pages/aluno/`

### Meus projetos — `/aluno` → `MyProjectsPage.jsx`

Tela "Meus projetos do aluno":

1. hero — selo "Área do aluno", h1 "Minhas ideias em ação.", lead e botão
   "+ Novo projeto";
2. estatísticas — Publicado / Em análise / Rascunho (contagem dinâmica);
3. seção "Seus projetos" com seletor "Todos (N)";
4. grade de cartões — badge de status, título, meta do curso/período, linha
   do status (aprovação / envio / última edição) e ação principal (Ver
   projeto · Acompanhar análise · Continuar edição). O "..." do topo do
   cartão abre caixinha com a ação de status, "Ver projeto" e "Copiar link"
   (fecha ao clicar fora).

O cartão é montado na própria página (não usa `<ProjectCard>`) porque o
protótipo tem estrutura própria, sem descrição/tecnologias. Mobile-first:
1 coluna; ≥1024px: 3 colunas.

### Novo projeto — `/aluno/novo` → `NewProjectPage.jsx`

Tela "Publicação de projeto". Briefing: a entrega do aluno
é feita **apenas com 3 links** (GitHub, Live Preview e Documentação /
Portfólio) — sem upload de PDF e sem notas numéricas. Ao enviar, o projeto
entra em "análise" e o aluno é levado à confirmação "Enviado para análise!".
O formulário abre com o rascunho EcoCampus ("Rascunho salvo às 09:38").
Desktop ≥1024px: 2 colunas — "Sobre o projeto" e "Quem participa" à
esquerda; materiais, visibilidade e ações à direita.

### Status da análise — `/aluno/status/:slug` → `ProjectStatusPage.jsx`

Duas telas do protótipo 03, selecionadas por `?enviado=1`:

- **`?enviado=1` — "Enviado para análise!"**: hero com selo "Envio do
  projeto", resumo do projeto + aviso "O projeto ainda NÃO está publicado",
  card "Enviado ao orientador" (parecer + arquivo) e coluna "E agora?" com
  ações "Acompanhar análise" / "Voltar aos meus projetos".
- **Padrão — "Análise de Biblioteca Conectada"**: h1 "Status do Projeto",
  banner âmbar "Aguardando o parecer do orientador", card "Etapas da
  análise" (linha do tempo qualitativa) e coluna com "Quem acompanha" +
  "Nenhum parecer registrado" + botão de volta.

Linha do tempo e acompanhantes vêm do mock (`ANALYSIS_STEPS` /
`ANALYSIS_WATCHERS`).

---

## Professor / Coordenador (painel) — `src/pages/staff/`

### Painel da equipe — `/painel` → `StaffPanelPage.jsx`

Um único ponto de entrada que escolhe a **face** conforme o espaço ativo:

- só `professor` → `ProfessorFace` (fila de revisão + orientações);
- só `coordenador` → `CoordinatorFace` (métricas + alerta + áreas);
- os dois (unido) → `UnifiedFace` com abas "Painel unificado | Atalhos"
  (aba de atalhos).

As três faces ficam em `components/staff/` e leem os números dos mocks
(fila de revisão, grupos, entregáveis) via `staffMetrics.js` — nada fixo.

### Trabalhos enviados — `/painel/entregas` → `DeliveriesPage.jsx`

Visão do professor sobre as entregas dos alunos: cartões de estatística
(StatCard — "Em análise" em destaque vermelho × "Publicado"), busca por
projeto/aluno, chips de turma/situação e grade de cards com relógio de
status, link para a entrega completa (`/painel/entrega/:slug`) e estado
vazio. Fonte única: `PROJECTS` no mock.

### Revisão do projeto — `/painel/revisar/:slug` → `ReviewPage.jsx`

Tela em 2 colunas no desktop, empilhada no mobile:

- **coluna principal** — badge de situação ("Aguardando seu parecer") + data
  do envio, título, metadados da turma, equipe e orientador, "Resumo do
  projeto" e "Materiais enviados" (arquivos + atalho "Link do Projeto");
- **coluna lateral** — card "Critérios de revisão" (checklist marcável),
  bloco "Seu parecer" (textarea), callout "Você decide a próxima etapa" e
  as decisões **"Aprovar e publicar"** / **"Solicitar ajustes"** com nota de
  notificação da equipe.

Estados iniciais já vêm preenchidos: critérios conferidos e parecer de
exemplo preenchido — desmarcar um critério volta a bloquear a aprovação.
As decisões levam a `/painel/resultado/:slug`.

### Resultado da revisão — `/painel/resultado/:slug` → `ReviewResultPage.jsx`

Confirmação da decisão do professor, em duas variantes:

- padrão → "Projeto aprovado e publicado!" (banner de sucesso, badge
  "Publicado", parecer do orientador, checklist e ação "Ver projeto
  publicado");
- `?decisao=ajustes` → "Ajustes solicitados" (banner de alerta, o que
  precisa de ajustes e ação "Ver detalhe da entrega").

Em ambos: resumo do projeto (título, equipe) e link "Voltar ao painel".

### Detalhe da entrega — `/painel/entrega/:slug` → `DeliveryPage.jsx`

Visão do professor/coordenador sobre uma entrega, em 2 colunas no desktop:

- **coluna principal** — badge "Área do professor" + situação da entrega
  (Aprovada / Ajustes solicitados / Em análise / Rascunho), selo do curso +
  status, título, metadados, equipe e orientador, "Sobre o projeto"
  (descrição + destaques), "Materiais enviados" (arquivos + contagem) e o
  card do link navegável com botão "Acessar projeto";
- **coluna lateral** — card "Revisão concluída" (parecer registrado +
  critérios + modal "Ver parecer registrado") **ou** callout "Revisão
  pendente" com botão "Revisar projeto"; e card "Upload de Evidências da
  Banca" com dropzones "Anexar fotos" e "Anexar ata ou registro" (upload
  simulado, só estado local).

### Histórico e evolução do grupo — `/painel/evolucao` → `EvolutionPage.jsx`

Relatório **qualitativo** (sem notas), em 2 colunas no desktop:

- topo — link "← Painel do professor", título "Evolução do grupo" e lead;
- card "Grupo selecionado" — select do grupo + linha da sala/período + nota
  de atualização dos dados;
- coluna esquerda — "Histórico por semestre": cards com selo do período,
  cadeado, marco, resumo e evidência, encerrados no botão "Exportar
  relatório";
- coluna direita — "Evolução qualitativa": cards de critérios
  comportamentais (título, resumo e evidência).

Fonte única: `GROUP_EVOLUTION` no mock.

### Gestão de grupos — `/painel/grupos` → `GroupsPage.jsx` (coordenação)

Badge "Acompanhamento dos projetos" + h1 "Gestão de grupos — DSM", 2
StatCards ("Grupos ativos" e "Grupos com pendências"), título "Grupos do
semestre · 2026.2" e grade de cards (nome, selo + semestre, integrantes,
pendência em caixa rosa, documentação e ações). O modal "Adicionar link de
documentação" simula a correção da pendência (salvar o link limpa a
pendência do grupo). Fonte única: `GROUPS` no mock.

### Relatório consolidado — `/painel/relatorio-consolidado` → `RelatorioConsolidadoPage.jsx` (coordenação)

Uma única rota com **duas faces**, escolhidas pelo papel ativo:

- só coordenador → `SemesterReport` (face do semestre);
- coordenador **+** professor → `CohortReport` (face da coorte).

As faces ficam em `components/staff/` com classes compartilhadas em
`ReportShared.module.css`; grupos e alunos vêm de `GROUPS` no mock.
"Exportar relatório em PDF" / "Exportar PDF" / "Imprimir" chamam
`window.print()` — é **simulação**, não há geração real de PDF.

### Meu projeto e materiais — `/painel/meu-projeto` → `ProfessorProjectPage.jsx`

Lista de projetos sob orientação (filtro por `ADVISED_GROUP_IDS`, ids de
equipe `team-*`). Estrutura: "Visão Professor — meu projeto e
materiais": topo com badge "Área do professor", ação "Gerenciar materiais e
links", h1 "Meu projeto e materiais" e lead; cabeçalho "Projetos sob
orientação · N projetos"; **um bloco por projeto** (status, equipe,
documentos e links) — a anatomia do bloco vive em
`components/staff/ProjectBlock.jsx`.

---

## Secretaria — `src/pages/secretary/`

### Cadastro de cursos — `/secretaria/cursos` → `CoursesPage.jsx`

Tela institucional de cursos em quatro blocos:

1. **cabeçalho** — badge "Gestão institucional" + h1 + lead com botão
   "+ Cadastrar novo curso" (abre modal de cadastro simulado);
2. **coluna esquerda** — "Cursos cadastrados" + lista de cards (código
   grande, nome, meta e ações "Editar curso" / "Desativar") e card rosa
   "Disponibilidade no MVP";
3. **coluna direita** (≥1024px; abaixo da lista no mobile) — painel "Editar
   curso" com selo da sigla, campos "Sigla _" e "Nome do curso _", bloco
   "Curso ativo" com switch e botões "Salvar alterações" / "Cancelar
   edição";
4. **modal** de cadastro de novos cursos (nome, código e turno).

Todo o estado é local (`useState`) — protótipo sem backend.

---

## Regras transversais de todas as telas

- Estilo **sempre** em CSS Module (nunca estilo inline);
- cores **somente** via variáveis CSS (nunca hex direto);
- ícones apenas de `react-icons/fi`;
- dados sempre de `src/mocks/projectsMock.js` (nada fixo na tela);
- toda persistência é simulada (localStorage/sessão apenas para "lembrar"
  a engajamento e a sessão do usuário no protótipo).
