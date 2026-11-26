# 02 — Arquitetura

Stack: **React 18** + **React Router v6** + **Vite 5** + **CSS Modules**,
`react-icons/fi`, `framer-motion`. Sem backend.

```
main.jsx  →  AuthProvider + EngagementProvider + BrowserRouter + <App/>
App.jsx   →  25 rotas (React.lazy) + layouts + guardas RBAC
```

## 1. Rotas (`src/App.jsx`)

As 25 rotas estão agrupadas em quatro blocos conforme o **shell** que
servem. `App.jsx` é o único arquivo que importa `src/pages/` — por isso o
code splitting é completo.

### Bloco 1 — `PublicLayout` (6 rotas)

Tela cheia para visitantes, sem barra de app.

```
/                 WelcomePage
/login            LoginPage
/cadastro         SignupPage
/recuperar-senha  RecoveryPage
/termos           TermsPage
/privacidade      PrivacyPage
```

### Bloco 2 — `MainLayout` (13 rotas)

Barra principal com `<Outlet/>` (TopBar + SideNav no desktop, BottomNav no
mobile).

```
/explorar                     ExplorePage                     todos
/projeto/:slug                ProjectPage                     todos
/ajuda                        HelpPage                        todos
/perfil                       ProfilePage                     logado
/alterar-senha                ChangePasswordPage              logado
/aluno                        MyProjectsPage                  aluno
/aluno/novo                   NewProjectPage                  aluno
/aluno/status/:slug           ProjectStatusPage               aluno
/painel                       StaffPanelPage                  professor | coordenador
/painel/entregas              DeliveriesPage                  professor | coordenador
/painel/evolucao              EvolutionPage                   professor | coordenador
/painel/grupos                GroupsPage                      coordenador
/painel/relatorio-consolidado RelatorioConsolidadoPage        coordenador
/secretaria/cursos            CoursesPage                     coordenador (secretaria legado)
```

> `/perfil` e `/alterar-senha` usam `<RequireRole>` **sem** `roles`, ou seja:
> qualquer usuário logado. Redirecionam para `/login` se deslogado.

### Bloco 3 — `StackShell` (4 rotas)

Barra empilhada com botão voltar. `StackShell` **resolve o título a partir
dos parâmetros da rota** (não recebe título fixo), o que é o que permite o
mesmo shell servir rotas diferentes:

```
/projeto/:slug         → resolveTitle={projectTitle}  fallback="Projeto"
/painel/revisar/:slug  fallback="Revisar projeto"
/painel/resultado/:slug fallback="Resultado da análise"
/painel/entrega/:slug  fallback="Detalhe da entrega"
/painel/meu-projeto    fallback="Meu projeto e materiais"
```

Cada uma envolve a tela em `<RequireRole roles={[...]}>`.

### Bloco 4 — fallback

```
*   → NotFoundPage
```

### Árvore visual

```
<Routes>
├── PublicLayout
│   ├── /  /login  /cadastro  /recuperar-senha  /termos  /privacidade
├── MainLayout
│   ├── /explorar  /projeto/:slug  /ajuda
│   ├── /perfil            (RequireRole)
│   ├── /alterar-senha     (RequireRole)
│   ├── /aluno             (RequireRole: aluno)
│   ├── /aluno/novo        (RequireRole: aluno)
│   ├── /aluno/status/:slug(RequireRole: aluno)
│   ├── /painel            (RequireRole: professor|coordenador)
│   ├── /painel/entregas   (RequireRole: professor|coordenador)
│   ├── /painel/evolucao   (RequireRole: professor|coordenador)
│   ├── /painel/grupos     (RequireRole: coordenador)
│   ├── /painel/relatorio-consolidado (RequireRole: coordenador)
│   └── /secretaria/cursos (RequireRole: coordenador|secretaria)
├── StackShell (resolveTitle / fallback)
│   ├── /projeto/:slug                    (index → ProjectPage)
│   ├── /painel/revisar/:slug             (RequireRole: professor)
│   ├── /painel/resultado/:slug           (RequireRole: professor)
│   ├── /painel/entrega/:slug             (RequireRole: professor|coordenador)
│   └── /painel/meu-projeto               (RequireRole: professor)
└── *  → NotFoundPage
```

## 2. Layouts (`src/components/layout/`)

| Componente | Papel |
| --- | --- |
| `PublicLayout` | Tela cheia do visitante; animações de conteúdo (`motion.div` + `AnimatePresence`) |
| `MainLayout` | Envolvente logado: `TopBar` + `SideNav` (≥1024) + `BottomNav` (<1024) + `<Outlet/>` |
| `TopBar` | Marca, espaço ativo e ações — **sem animação** (barras nunca animam) |
| `SideNav` | Navegação lateral no desktop, agrupada por área (acadêmica, equipe, coordenação) |
| `BottomNav` | Navegação inferior no mobile |

### `StackShell` (`src/components/routing/`)

Variante de barra superior **empilhada** (voltar + título) para rotas de
detalhe. O título é resolvido pelos **parâmetros da rota**, não passado como
prop fixa — é o que permite `/projeto/:slug` exibir o título real do projeto
e as rotas `/painel/*` usarem um fallback.

## 3. Guardas RBAC (`src/components/routing/RequireRole.jsx`)

```jsx
<RequireRole roles={['professor', 'coordenador']}>…</RequireRole>
```

Comportamento:

1. **Deslogado** → redireciona para `/login`.
2. **Logado, mas nenhum papel bate** → redireciona para a home da área
   (`/aluno` ou `/painel`; coordenação vai para `/painel`).
3. **Papel ok** → renderiza os filhos.

`roles` é opcional: sem ele, qualquer usuário logado passa.

O estado vem de `useAuth()` (papéis ativos = `roles` menos o espaço
desativado pelo **Espaço ativo** do Perfil).

## 4. Code splitting (`React.lazy`)

As **25 telas** são importadas dinamicamente e envolvidas por `<Suspense>`:

```jsx
const ExplorePage = lazy(() => import('./pages/ExplorePage.jsx'));
…
<Suspense fallback={<RouteFallback />}>
  <Routes>…</Routes>
</Suspense>
```

| Métrica | Antes | Depois |
| --- | --- | --- |
| Bundle principal (JS) | 509,76 kB | **379,74 kB** |
| Aviso de chunk > 500 kB | presente | **eliminado** |
| Chunks JS | 1 | 46 |

- **Síncrono no bundle principal**: layouts (`MainLayout`, `PublicLayout`),
  guardas (`RequireRole`, `StackShell`, `RouteFallback`), contextos, mocks e
  o kit `ui/`.
- **Uma condição**: todo arquivo de página precisa ter `export default`
  (o `lazy()` exige).
- `RouteFallback` (`routing/`) é um texto centrado com `role="status"` e
  `aria-live="polite"` — **sem animação**, para não depender de motion nem
  quebrar `prefers-reduced-motion`.

## 5. Contextos

### `AuthContext` — `src/context/AuthContext.jsx`

| Estado / ação | Descrição |
| --- | --- |
| `user` | Usuário logado (`null` se visitante) |
| `roles` | Papéis do usuário (`['professor', 'coordenador']`) |
| `space` | Espaço ativo (o que o cabeçalho mostra) |
| `login(id)` / `logout()` | Simulados |
| `isRole(role)` | `true` se o papel está ativo |
| `setSpace(roles)` | Troca o **Espaço ativo** (seletor do Perfil) |

### `EngagementContext` — `src/context/EngagementContext.jsx`

| Conceito | Regra |
| --- | --- |
| **Views** | +1 por **sessão do navegador** ao abrir `/projeto/:slug`. Recarregar (F5) não infla; fechar a aba libera. Sessão em `sessionStorage` (`pi2.viewed`). |
| **Curtidas** | Só **usuários logados** curtem **projetos publicados**. A equipe dona **não** curte o próprio projeto. Persistência em `localStorage` (`pi2.engagement`). |
| Estado inicial | Campos `views` e `likes` de cada projeto no mock |

Os contadores aparecem nos cards (vitrine, explorar, meus projetos) e no card
**Engajamento** do projeto.

## 6. Camadas e dependências

```
pages/            → só importa components/, context/, mocks/, utils/, hooks/
components/staff  → faces e blocos das telas da equipe
components/project→ subcomponentes da tela de detalhe do projeto
components/routing→ guardas e shells (RequireRole, StackShell, RouteFallback)
components/ui     → kit genérico, sem conhecimento de domínio
components/layout → barras e envelopadores
context/          → estado global (auth, engajamento)
mocks/            → fonte única de dados
utils/ e hooks/   → lógica pura e comportamento reutilizável
styles/           → tokens globais + reset + variantes de motion
```

Regras de dependência:

- `components/ui/**` **não** importa `pages/`, `mocks/` nem `context/`;
- `pages/**` **não** importa outras `pages/**`;
- **só** `App.jsx` importa `pages/**` (garante o split);
- nada importa `dist/`.

## 7. Estrutura de pastas

```
src/
├── main.jsx             # entrada: React + Router + AuthProvider + EngagementProvider
├── App.jsx              # 25 rotas (lazy), layouts e guardas
├── styles/
│   ├── variables.css    # ÚNICO lugar com cores/fontes/espaços/raios/sombras
│   ├── reset.css        # reset global
│   └── motion.js        # variantes centralizadas do framer-motion
├── mocks/
│   ├── projectsMock.js  # projetos, equipes, grupos, evolução, evidências
│   └── usersMock.js     # perfis, spaceLabelFor, spaceOptionsFor
├── context/
│   ├── AuthContext.jsx
│   └── EngagementContext.jsx
├── utils/
│   ├── status.js        # statusMeta / statusOptions / STATUS_VALUES
│   └── format.js        # datas e números
├── hooks/
│   ├── useClickOutside.js
│   └── useCopyToClipboard.js
├── components/
│   ├── ui/              # 18 componentes, um por pasta
│   ├── layout/          # TopBar, BottomNav, SideNav, MainLayout, PublicLayout
│   ├── routing/         # RequireRole, StackShell, RouteFallback
│   ├── public/          # ProjectCard, LegalPage
│   ├── project/         # ProjectComments, ProjectSidebar
│   ├── staff/           # faces e blocos da equipe
│   └── icons/           # Logo (SVG da marca)
└── pages/
    ├── public/          # 6 telas do visitante
    ├── aluno/           # 3 telas
    ├── staff/           # 9 telas
    ├── secretary/       # 1 tela
    └── *.jsx            # 6 telas raiz
```

## 8. Para adicionar uma rota

1. Crie `src/pages/<area>/MinhaTela.jsx` com `export default` e JSDoc no topo.
2. Crie `src/pages/<area>/MinhaTela.module.css` (sem estilos inline).
3. Em `App.jsx`: adicione `const MinhaTela = lazy(() => import(...))`.
4. Adicione o `<Route>` no bloco de shell adequado, envolvendo em
   `<RequireRole roles={[...]}>` se for restrito.
5. Adicione o item na tabela de rotas do `README.md` e em
   [`03-telas.md`](03-telas.md).
6. Rode `npm run build` e confira que não há aviso de chunk > 500 kB.

## 9. Verificações manuais úteis

```bash
npm run build                      # precisa passar sem aviso de chunk > 500 kB
grep -rn "style={{" src/           # precisa retornar nada (estilo inline proibido)
grep -rn "react-icons/fi" src/ | wc -l   # ícones só de react-icons/fi
```
