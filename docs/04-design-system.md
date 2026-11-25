# 04 — Design system

## 1. Tokens — `src/styles/variables.css`

**Único arquivo** com cores, tipografia, espaçamentos, raios, sombras,
transições e medidas de layout (59 tokens). Componentes e páginas só usam
`var(--token)` — trocar a paleta ou a tipografia em um arquivo atualiza o
sistema inteiro.

### Cores

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-primary` | `#b80000` | vermelho dos botões, links e itens ativos |
| `--color-primary-dark` | `#9e0000` | hover / pressed |
| `--color-primary-soft` | `#fdeeee` | fundo suave (badges, alertas) |
| `--color-dark` | `#1a1a1a` | acentos escuros |
| `--color-bg-page` | `#fafafa` | fundo das páginas |
| `--color-bg-surface` | `#ffffff` | fundo de cards, modais e inputs |
| `--color-border` | `#e5e5e5` | borda leve (divisórias, cards) |
| `--color-border-strong` | `#cccccc` | borda forte (inputs, contornos) |
| `--color-text-title` | `#111111` | títulos |
| `--color-text-body` | `#333333` | corpo |
| `--color-text-muted` | `#666666` | textos secundários / legendas |
| `--color-text-inverse` | `#ffffff` | texto sobre fundo escuro/vermelho |
| `--color-success` / `-soft` | `#1f7a3d` / `#e8f4ec` | sucesso |
| `--color-warning` / `-soft` | `#9a6700` / `#fcf3df` | aviso |
| `--color-danger-soft` | `#fdeeee` | alertas em fundo rosa claro |
| `--color-overlay` | `rgba(17,17,17,.45)` | fundo de modais/bottom sheets |

> **Única exceção às cores numéricas:** `src/components/icons/Logo.jsx`,
> que carrega a marca em SVG.

### Tipografia

- Família: `--font-family: 'Inter', system-ui, …`
- Tamanhos: `--font-size-xs` 12 · `sm` 14 · `md` 16 · `lg` 18 · `xl` 24 ·
  `2xl` 32 · `3xl` 40 px
- Pesos: `--font-weight-regular|medium|semibold|bold` (400/500/600/700)
- Altura de linha: `--line-height-tight` 1,15 · `--line-height-normal` 1,5
- `--letter-spacing-caps: 0.06em` — rótulos em CAIXA ALTA

### Espaçamento e forma

- `--space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 20 · `6` 24 · `8` 32 ·
  `10` 40 · `12` 48 · `16` 64 px
- Raios: `--radius-sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `pill` 999 px
- Sombras: `--shadow-sm|md|lg`

### Movimento e medidas

- `--transition-fast: 150ms ease` · `--transition-base: 250ms ease`
- `--content-max: 1120px` (largura no desktop)
- `--header-height: 72px` · `--topbar-height: 56px` ·
  `--bottom-nav-height: 64px` · `--card-cover-height: 180px`

---

## 2. Kit de componentes — `src/components/ui/`

**18 componentes genéricos**, um por pasta, cada um com seu `*.module.css`.
Nenhum deles importa `pages/`, `mocks/` ou `context/` — são puros de
interface.

| Componente | Papel |
| --- | --- |
| `Avatar` | Inicial/foto do usuário |
| `Badge` | Pílula de status (`tone`: primary/success/warning/neutral…) |
| `Breadcrumb` | Trilha de navegação |
| `Button` | Ação (`variant`: primary/secondary, `fullWidth`, `icon`) |
| `Callout` | Bloco de aviso com ícone, título e ação |
| `Card` | Superfície com `padding` (`sm`/`md`/`lg`) |
| `FileList` | Lista vertical de arquivos |
| `FileRow` | Ladrilho de arquivo (nome, meta, ícone) + `LeadingIcon` |
| `FilterChips` | Chips de filtro |
| `ListRow` | Linha de navegação com ícone, título, badge e destino |
| `Modal` | Diálogo sobreposto |
| `PageHeader` | **Cabeçalho padrão** de página (eyebrow + título + lead + ações) |
| `Popover` | Painel ancorado |
| `SearchField` | Campo de busca |
| `SectionHeader` | Cabeçalho de seção (título + subtítulo + ação) |
| `Select` | Seletor nativo estilizado |
| `StatCard` | Métrica grande (valor + rótulo + tom) |
| `Tabs` | Abas com pílula deslizante |
| `TextField` | Campo de texto com label/erro |

### `PageHeader` — o cabeçalho padrão

Substituiu ~13 blocos `<header>` duplicados em 11 telas. Props principais:

| Prop | Efeito |
| --- | --- |
| `eyebrow` | pill acima do h1 (string ou nó, ex.: `<Badge>`) |
| `caps` | pill em CAIXA ALTA com letter-spacing |
| `title` / `lead` | h1 e texto de apoio |
| `actions` | botões à direita |
| `actionsTop` | eyebrow + ações numa linha **acima** do título |
| `gap` | `sm` \| `md` \| `lg` entre eyebrow/título/lead |
| `split` | empilha as ações abaixo em telas estreitas |
| `className` | hook para a página estilizar descendentes (ex.: `.pageHeader h1`) |

---

## 3. Animations — `src/styles/motion.js` + framer-motion

**Regra de ouro:** animam **apenas o conteúdo** (`MainLayout` e
`PublicLayout` envolvem o `<Outlet/>` com `motion.div` + `AnimatePresence`).
As **barras nunca animam** (`TopBar`, `SideNav`, `BottomNav`).

Padrões usados:

| Padrão | Onde |
| --- | --- |
| Stagger no hero | vitrine pública |
| Cascata nos cards | listas de projeto |
| Escala no toque | botões e chips |
| Pílula deslizante | abas (`Tabs`) |

As variantes ficam centralizadas em `src/styles/motion.js` — **não** recrie
variantes locais.

> `prefers-reduced-motion` é respeitado nas rolagens suaves (ex.: o scroll da
> seção "Minhas orientações" do painel do professor usa `behavior: 'auto'`
> quando reduzido). `RouteFallback` é estático justamente para não depender
> de motion.

---

## 4. Breakpoints e layout

- **Mobile-first**, dois breakpoints: **768px** (tablet) e **1024px** (desktop).
- No desktop (≥1024) aparece o `SideNav` lateral; abaixo dele, o `BottomNav`.
- Grade padrão de detalhe: `minmax(0, 1.6fr) minmax(0, 1fr)` (principal +
  lateral sticky).
- Largura de conteúdo: `--content-max: 1120px`.

---

## 5. Regras obrigatórias

1. **Nada de estilos inline** — `style={{ … }}` é **proibido** em qualquer
   elemento JSX.
2. **Um componente por arquivo** (SRP) — incluindo subcomponentes e faces;
   cada um com seu próprio `*.module.css`.
3. **CSS Modules por componente** — classes estruturais compartilhadas por
   várias faces de uma mesma feature vivem num módulo próprio
   (`StaffPanelShared.module.css`, `ReportShared.module.css`) e devem ser
   importados **antes** do módulo da face, para que as classes da face
   sobrescrevam as compartilhadas.
4. **Cores numéricas só em `variables.css`** (exceção: `Logo.jsx`).
5. **Ícones só de `react-icons/fi`** (traço fino dos protótipos).
6. **JSDoc no topo de todo arquivo** (`.jsx`, `.js`, `.module.css`), em pt-BR.
7. **Um `<h1>` por rota** (ramos de renderização mutuamente excluíentes são
   aceitáveis — ex.: `ProjectStatusPage`).
8. **Fidelidade visual aos prints** em [`prints/`](../prints).
