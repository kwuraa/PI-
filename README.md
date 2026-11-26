# PI² — Repositório Acadêmico

Front-end do **PI²**, plataforma que reúne os **Projetos Integradores** do curso
**DSM · Desenvolvimento de Software**. Os alunos publicam entregas por links,
professores revisam com critérios qualitativos e a coordenação acompanha os
grupos e gerencia os cursos.

> Protótipo didático: **não há backend**. Login, envios, revisões e uploads são
> simulados com dados locais (`src/mocks`).

---

## ▶️ Como rodar

Requisitos: [Node.js](https://nodejs.org) 18+ e npm.

```bash
npm install      # instala as dependências (uma vez)
npm run dev      # sobe o servidor de desenvolvimento (Vite)
npm run build    # gera a versão de produção em dist/
npm run preview  # serve o build de produção localmente
```

Abra no navegador o endereço exibido no terminal (padrão:
`http://localhost:5173`).

---

## 🧭 Rotas

Todas as **25 rotas** declaradas em `src/App.jsx`. A coluna **Tela** aponta o
arquivo em `src/pages/`; **Acesso** é o papel exigido pela guarda
`RequireRole` (vazio = qualquer visitante).

### Públicas — `PublicLayout`

| Rota               | Tela                                                            | Acesso    |
| ------------------ | --------------------------------------------------------------- | --------- |
| `/`                | Boas-vindas + vitrine pública (busca, semestre, cards anônimos) | visitante |
| `/login`           | Acesso com 3 perfis simulados                                   | visitante |
| `/cadastro`        | Cadastro institucional (curso travado no DSM)                   | visitante |
| `/recuperar-senha` | Recuperação de senha simulada                                   | visitante |
| `/termos`          | Termos de uso (página legal)                                    | visitante |
| `/privacidade`     | Política de privacidade / LGPD                                  | visitante |

### Barra principal — `MainLayout`

| Rota                            | Tela                                                      | Acesso                 |
| ------------------------------- | --------------------------------------------------------- | ---------------------- |
| `/explorar`                     | Busca + filtros em bottom sheet                           | todos                  |
| `/projeto/:slug`                | Detalhe do projeto (público anônimo / logado completo)    | todos                  |
| `/ajuda`                        | Central de ajuda (artigos + busca)                        | todos                  |
| `/perfil`                       | Dados, notificações, espaço ativo e logout                | logado                 |
| `/alterar-senha`                | Troca de senha da conta                                   | logado                 |
| `/aluno`                        | Meus projetos (lista + status)                            | aluno                  |
| `/aluno/novo`                   | Publicação com **3 links** (GitHub, Live Preview, Docs)   | aluno                  |
| `/aluno/status/:slug`           | Acompanhamento da análise (etapas qualitativas)           | aluno                  |
| `/painel`                       | Painel professor / coordenador / **unificado** (com abas) | professor, coordenador |
| `/painel/entregas`              | Fila de entregas com filtros e busca                      | professor, coordenador |
| `/painel/evolucao`              | Relatório por projeto de PI sob orientação do professor   | professor, coordenador |
| `/painel/grupos`                | Gestão de grupos + link de documentação                   | coordenador            |
| `/painel/relatorio-consolidado` | Relatório consolidado (face do semestre **ou** da coorte) | coordenador            |
| `/secretaria/cursos`            | Cadastro de cursos (modal)                                | coordenador            |

### Barra empilhada — `StackShell` (detalhes)

| Rota                      | Tela                                               | Acesso                 |
| ------------------------- | -------------------------------------------------- | ---------------------- |
| `/painel/revisar/:slug`   | Revisão com checklist + parecer                    | professor              |
| `/painel/resultado/:slug` | Desfecho: aprovado ou ajustes (`?decisao=ajustes`) | professor              |
| `/painel/entrega/:slug`   | Detalhe da entrega + upload de evidências          | professor, coordenador |
| `/painel/meu-projeto`     | Projeto sob orientação + materiais                 | professor              |

### Fallback

| Rota | Tela                        | Acesso |
| ---- | --------------------------- | ------ |
| `*`  | Página não encontrada (404) | todos  |

**Perfis do login (mock):** Aluno (Ana Costa), Professor (Rafael Martins —
também coordena, use **Espaço ativo** no Perfil para ver o painel unificado) e
Coordenador (Marta Campos). Helena Souza (`secretaria`) é um usuário legado com
acesso equivalente ao da coordenação.

---

## 🖥️ As 25 telas

Arquivo em `src/pages/`, uma pasta por área.

### `pages/public/` — tela do visitante

| Arquivo                     | O que mostra                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `WelcomePage`               | Hero institucional + vitrine com busca, seletor de semestre e cards de projeto                                |
| `LoginPage`                 | Acesso com 3 perfis de acesso rápido (escolha didática para o avaliador); papéis legados não têm atalho |
| `SignupPage`                | Cadastro institucional com curso travado em DSM                                                               |
| `RecoveryPage`              | Recuperação de senha simulada                                                                                 |
| `TermsPage` / `PrivacyPage` | Páginas legais (componente compartilhado `LegalPage`)                                                         |

### `pages/` (raiz) — telas logadas genéricas

| Arquivo              | O que mostra                                                                            |
| -------------------- | --------------------------------------------------------------------------------------- |
| `ExplorePage`        | Busca + filtros em bottom sheet + resultado em cards                                    |
| `ProjectPage`        | **Detalhe do projeto**: hero, links, equipe (LGPD), arquivos, comentários e engajamento |
| `ProfilePage`        | Dados da conta, notificações, **Espaço ativo** (troca de papel) e logout                |
| `ChangePasswordPage` | Troca de senha da conta                                                                 |
| `HelpPage`           | Central de ajuda com busca e artigos                                                    |
| `NotFoundPage`       | 404                                                                                     |

### `pages/aluno/` — visão do aluno

| Arquivo             | O que mostra                                     |
| ------------------- | ------------------------------------------------ |
| `MyProjectsPage`    | Lista dos projetos do aluno com status e ações   |
| `NewProjectPage`    | Publicação de projeto com 3 links obrigatórios   |
| `ProjectStatusPage` | Acompanhamento da análise em etapas qualitativas |

### `pages/staff/` — visão da equipe

| Arquivo                    | O que mostra                                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `StaffPanelPage`           | Entrada única que escolhe a **face** pelo espaço ativo: `ProfessorFace`, `CoordinatorFace` ou `UnifiedFace` (com abas) |
| `ReviewPage`               | Revisão com checklist de critérios e parecer                                                                           |
| `ReviewResultPage`         | Desfecho da análise: aprovado ou ajustes                                                                               |
| `DeliveryPage`             | Detalhe da entrega + upload de evidências                                                                              |
| `DeliveriesPage`           | Fila de entregas com filtros e busca                                                                                   |
| `EvolutionPage`            | Relatório por projeto: seletor dos PIs do professor + histórico e evidências                                          |
| `GroupsPage`               | Gestão de grupos + link de documentação                                                                                |
| `RelatorioConsolidadoPage` | Escolhe entre `SemesterReport` (face 06) e `CohortReport` (face 08) conforme o papel                                   |
| `ProfessorProjectPage`     | Meus projetos sob orientação + materiais (um `ProjectBlock` por projeto)                                               |

### `pages/secretary/`

| Arquivo       | O que mostra                           |
| ------------- | -------------------------------------- |
| `CoursesPage` | Cadastro e listagem de cursos em modal |

---

## ⚙️ Arquitetura

### Layouts e guardas (`src/components/routing/`)

| Componente      | Papel                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `PublicLayout`  | Tela cheia para visitantes (sem barra de app); animações no conteúdo                                                      |
| `MainLayout`    | Barra principal (`TopBar` + `SideNav` no desktop, `BottomNav` no mobile) com `<Outlet/>`                                  |
| `StackShell`    | Barra empilhada com voltar + título; **resolve o título a partir dos parâmetros** da rota (`/projeto/:slug`, `/painel/*`) |
| `RequireRole`   | Guarda RBAC — redireciona para `/login` se deslogado ou para a home da área se o papel não bate                           |
| `RouteFallback` | Texto centrado com `role="status"` exibido enquanto o chunk da rota chega                                                 |

### Carregamento por rota (code splitting)

As **25 telas** são importadas com `React.lazy` em `App.jsx` e envolvidas por
`<Suspense fallback={<RouteFallback />}>`. Layouts, guardas, contextos e mocks
permanecem síncronos no bundle principal.

| Métrica                 | Antes     | Depois        |
| ----------------------- | --------- | ------------- |
| Bundle principal (JS)   | 509,76 kB | **379,74 kB** |
| Aviso de chunk > 500 kB | presente  | **eliminado** |
| Chunks JS gerados       | 1         | 46            |

Nenhum arquivo fora de `App.jsx` importa `pages/`, então o split é completo.

### Contextos

| Contexto            | Responsabilidade                                                                                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `AuthContext`       | Login/logout, papéis (`aluno`, `professor`, `coordenador` e `secretaria` legado), perfil ativo e **Espaço ativo**    |
| `EngagementContext` | Views (+1 por sessão) e curtidas, persistidas em `localStorage` (`pi2.engagement`) e `sessionStorage` (`pi2.viewed`) |

### Dados e helpers

| Caminho                     | Conteúdo                                                           |
| --------------------------- | ------------------------------------------------------------------ |
| `src/mocks/projectsMock.js` | Projetos, equipes, grupos, evolução, etapas de análise, evidências |
| `src/mocks/usersMock.js`    | Perfis do login, `spaceLabelFor`, `spaceOptionsFor`                |
| `src/utils/status.js`       | `statusMeta()` — rótulo, tom e ícone de cada status (fonte única)  |
| `src/utils/format.js`       | Formatação de datas e números                                      |
| `src/hooks/`                | `useClickOutside`, `useCopyToClipboard`                            |
| `src/styles/motion.js`      | Variantes centralizadas do framer-motion                           |

---

## 👁️ Views e curtidas (engajamento dos projetos)

- **Views**: abrir `/projeto/:slug` conta **+1 por sessão do navegador**
  (recarregar com F5 não infla a contagem; fechar a aba libera para contar
  de novo na próxima visita).
- **Curtidas**: apenas **usuários logados** curtem **projetos publicados** —
  o botão alterna _Curtir projeto_ ⇄ _Curtido_; o visitante vê a contagem e o
  convite _Entre para curtir_. A **equipe dona não curte o próprio projeto**:
  no lugar do botão aparece uma nota ("Projeto da sua equipe — curtir conta
  para a comunidade").
- Os contadores ficam à mostra **nos cards** (vitrine, explorar, meus
  projetos) e no card **Engajamento** da página do projeto.
- Totais iniciais: campos `views`/`likes` de cada projeto no mock; os
  incrementos são persistidos em `localStorage` (`pi2.engagement`) e as
  views da sessão em `sessionStorage` (`pi2.viewed`), tudo em
  `src/context/EngagementContext.jsx`.

---

## ✏️ Como editar os dados (mocks)

Todo o conteúdo de tela vem de dois arquivos — **sem tocar em JSX**:

- **`src/mocks/projectsMock.js`** — projetos, equipes, grupos, evolução,
  etapas de análise e evidências. Altere títulos, descrições, status
  (`rascunho | em-analise | publicado | ajustes`), semestres, tecnologias,
  comentários e pareceres.
  - `teamDisplay(project, { publicView })` aplica a **LGPD**: em vistas
    públicas a equipe aparece só como `Equipe DSM — Xº Semestre`.
  - `views` e `likes` de cada projeto são o **estado inicial** das métricas
    de engajamento (as contagens rodando ficam em `EngagementContext`).
  - `statusMeta(status)` (em `src/utils/status.js`) devolve rótulo, tom e
    ícone de cada status — **não duplique esse mapeamento**.
- **`src/mocks/usersMock.js`** — perfis do login, rótulo de espaço do
  cabeçalho (`spaceLabelFor`) e opções de troca de perfil (`spaceOptionsFor`).

Os dados são **exclusivamente do DSM** (curso, tecnologias e exemplos de PI
por semestre) — mantenha essa regra ao editar.

---

## 🎨 Como editar os tokens (design system)

**`src/styles/variables.css`** é o único lugar com cores, fontes, espaçamentos,
raios e sombras. Componentes e páginas só usam `var(--token)` — por isso
mudar a paleta ou a tipografia em um arquivo atualiza o sistema inteiro.

```css
--color-primary: #b80000; /* vermelho dos botões/links/ativos */
--color-bg-page: #fafafa; /* fundo das páginas */
--font-family: "Inter", …; /* tipografia */
```

**Kit de componentes** (`src/components/ui/`): `Avatar`, `Badge`,
`Breadcrumb`, `Button`, `Callout`, `Card`, `FileList`, `FileRow`,
`FilterChips`, `ListRow`, `Modal`, `PageHeader`, `Popover`, `SearchField`,
`SectionHeader`, `Select`, `StatCard`, `Tabs`, `TextField`.

Regras do projeto:

- **Nada de estilos inline** (`style={{ … }}` é proibido);
- **um componente por arquivo** (SRP) — incluindo subcomponentes e faces;
- cada componente importa o **próprio** `*.module.css` (CSS Modules);
  classes estruturais compartilhadas por várias faces de uma mesma feature
  vivem num módulo próprio (ex.: `StaffPanelShared.module.css`,
  `ReportShared.module.css`) e devem ser importados **antes** do módulo
  da face, para que as classes da face sobrescrevam as compartilhadas;
- cores numéricas só existem em `variables.css` (o logo, em
  `src/components/icons/Logo.jsx`, é a única exceção — é a marca);
- ícones vêm de **`react-icons/fi`** (traço fino dos protótipos);
- JSDoc no topo de **todo** arquivo (`.jsx`, `.js`, `.module.css`).

---

## 📁 Estrutura de pastas

```
src/
├── main.jsx             # entrada: monta React + Router + AuthProvider
├── App.jsx              # 25 rotas (React.lazy), guardas RBAC e layouts
├── styles/              # tokens globais (variables.css), reset.css, motion.js
├── mocks/               # dados simulados (projetos/usuários) — edite aqui
├── context/             # AuthContext (login, papéis) + EngagementContext
│                        #   (views e curtidas dos projetos)
├── utils/               # helpers puros (status.js, format.js)
├── hooks/               # useClickOutside, useCopyToClipboard
├── components/
│   ├── ui/              # kit genérico (18 componentes, um por pasta)
│   ├── layout/          # TopBar, BottomNav, SideNav, MainLayout, PublicLayout
│   ├── routing/         # RequireRole, StackShell, RouteFallback
│   ├── public/          # ProjectCard (variantes), LegalPage
│   ├── project/         # ProjectComments, ProjectSidebar (detalhe do projeto)
│   ├── staff/           # faces e blocos das telas da equipe
│   │                    #   StaffPanelPage → Professor/Coordinator/UnifiedFace
│   │                    #   RelatorioConsolidadoPage → Semester/CohortReport
│   │                    #   ProjectBlock, CalloutNotFound
│   └── icons/           # Logo oficial (SVG da marca)
└── pages/               # uma pasta por área: public/, aluno/, staff/,
                         # secretaria/ + páginas raiz (Explore, Profile…)
```

**Convenções:** JSDoc no topo de todo componente/CSS; um componente por
arquivo (SRP); dados compartilhados vivem nos mocks ou no contexto (DRY);
mobile-first com breakpoints 768px e 1024px; animações (framer-motion,
`motion.div` + `AnimatePresence`) acontecem apenas no conteúdo
(`MainLayout`/`PublicLayout`) — nunca nas barras (TopBar/BottomNav) — com
stagger no hero, cascata nos cards, escala no toque de botões/chips e pílula
deslizante nas abas; variantes centralizadas em `src/styles/motion.js`.

---

## 📚 Documentação

Detalhamento completo em [`docs/`](docs/):

| Arquivo                                                | Conteúdo                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------- |
| [`docs/01-visao-geral.md`](docs/01-visao-geral.md)     | O que é o PI², escopo do protótipo e personas                 |
| [`docs/02-arquitetura.md`](docs/02-arquitetura.md)     | Rotas, layouts, RBAC, code splitting e contextos              |
| [`docs/03-telas.md`](docs/03-telas.md)                 | As 25 telas e o que cada uma mostra |
| [`docs/04-design-system.md`](docs/04-design-system.md) | Tokens, kit de componentes e animações                        |
| [`docs/05-mocks.md`](docs/05-mocks.md)                 | Fonte de dados simulados e como editar                        |
| [`docs/06-refatoracao.md`](docs/06-refatoracao.md)     | Histórico das melhorias de código (itens 1–7)                 |
| [`docs/07-impressao-abnt.md`](docs/07-impressao-abnt.md) | Impressão provisória do relatório e como adicionar o timbre da FATEC |
