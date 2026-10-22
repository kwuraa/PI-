# Referência da Interface — PI²

> **Tipo de documento:** Referência (consulta rápida — dicionário do que existe e onde).
> **Público:** devs do projeto.
> Documentos relacionados: [Como criar uma tela](02-como-criar-uma-tela.md) · [Arquitetura e design system](03-arquitetura-e-design-system.md)

---

## 1. Mapa das telas

| Tela | Arquivo | Apelido | Sai para |
| --- | --- | --- | --- |
| **Boas-vindas** (landing) | `index.html` (na raiz) | welcome | `Entrar no PI²` → login · `Criar minha conta` → cadastro |
| **Login** | `src/pages/login/login.html` | login | `Voltar` → `index.html` · `Criar conta` → cadastro · `Esqueci minha senha` → recuperação · **`Entrar como aluno` → explore (área logada)** |
| **Cadastro** | `src/pages/signup/signup.html` | signup | `Voltar` → `index.html` · `Já tenho conta · Entrar` → login |
| **Recuperação de senha** | `src/pages/recovery/recovery.html` | recovery | `Voltar` (topbar e botão) → login · `Alterar senha` no perfil |
| **Explorar projetos** (área logada) | `src/pages/explore/explore.html` | explore | botão de filtro → **modal `#busca`** · cards → project · avatar/nav → saved, profile |
| **Detalhes do projeto** | `src/pages/project/project.html` | project | `Voltar`/nav → explore · nav → saved, profile |
| **Projetos salvos** | `src/pages/saved/saved.html` | saved | `Ver projeto` → project · `Explorar mais` → explore · nav → profile |
| **Perfil e configurações** | `src/pages/profile/profile.html` | profile | `Alterar senha` → recovery · `Sair da conta` → `index.html` · nav → explore, saved |

### 1.1. Boas-vindas — `index.html`

- **Título da aba:** `PI² — Grandes ideias. Conhecimento que se conecta.`
- **Conteúdo (celular):** marca (logo em SVG + wordmark), `eyebrow` "Repositório acadêmico", `hero-title`, `hero-lead`, um bloco `feature` e dois botões (`btn-pi` e `btn-pi-outline`), empilhados.
- **Rodapé:** `screen-caption` — "PI² · Ideias que multiplicam conhecimento".
- **Por que fica na raiz:** é a página inicial do site — o GitHub Pages/qualquer hospedagem estática exige `index.html` na raiz.
- **Layout desktop (≥ 992px):** passa a página inteira (sem o frame de celular). Vira `site-header` fixo no topo (marca + `nav` "Explorar projetos"/"Sobre o PI²" + botão outline "Acessar o PI²"), hero em 2 colunas (texto à esquerda; foto-placeholder com cartão "O próximo grande projeto pode ser o seu." à direita), faixa vermelha de métricas (1.248 projetos · 18 cursos · 320 professores), seção "Conheça o que nasce por aqui" com 3 `project-card` e `site-footer`. Os blocos desktop são `d-none d-lg-*` e não aparecem no celular.

### 1.2. Login — `src/pages/login/login.html`

- **Título da aba:** `Acessar o PI²`
- **Estrutura:** `topbar` (voltar · título · menu) → `page-title` "Bom ter você aqui." → `page-lead` → formulário `#login-form`.
- **Formulário:** seleção de perfil (radio cards **Aluno/Professor**, `role-card`) · `E-mail institucional` · `Senha` com botão de mostrar/ocultar · `remember-row` (lembrar + esqueci) · `Entrar como aluno` · `info-card`.
- **`Entrar como aluno` hoje é um `<a>`** para `../explore/explore.html` (área logada), com as classes de botão — sem JS o `<button type="submit">` não navegava. Quando o JS voltar, vira `<button type="submit">` de novo (com spinner e `submit-status`).
- **Rodapé:** `signup-row` — "Ainda não tem conta? Criar conta".
- **⚠️** a validação nativa está ativa (sem `novalidate`), mas o form não submete: `Entrar como aluno` é um link (ver seção 6).
- **Layout desktop (≥ 992px):** mesmo `site-header`/`site-footer` da boas-vindas; o `topbar` (voltar/título/menu) vira `d-lg-none` e é substituído pelo cabeçalho do site. O corpo vira 2 colunas: painel `promo-panel` à esquerda (título "Um lugar para ideias…", foto-placeholder e cartão "Feito por alunos. Conectado a professores.") e o formulário à direita (`login-panel`), com um `eyebrow` "Bem-vindo de volta" acima do `page-title`. O `promo-panel` é um **componente compartilhado** (`components.css`) usado também pelo cadastro.

### 1.3. Cadastro — `src/pages/signup/signup.html`

- **Título da aba:** `Criar conta — PI²`
- **Estrutura:** `topbar` → `page-title` "Suas ideias começam aqui." → `page-lead` → formulário `#signup-form`.
- **Formulário:** seleção de perfil (`role-card`) · **Seus dados**: nome, e-mail institucional, matrícula, curso (select), período (select) · **Crie sua senha**: senha e confirmação (ambas com botão de olho) · aceite dos `terms-check` · botão `btn-pi` "Criar conta de aluno" · `info-card` de vínculo institucional.
- **Rodapé:** `signin-row` — "Já tenho conta · Entrar".
- **Validação:** sem `novalidate` → a **validação nativa do navegador está ativa** (`required`, `minlength="8"`, `pattern` na matrícula, selects com placeholder desabilitado).
- **Layout desktop (≥ 992px):** mesmo `site-header`/`site-footer` das outras telas públicas; o `topbar` vira `d-lg-none`. O corpo vira 2 colunas: `promo-panel` à esquerda (mesmo componente do login, com texto próprio: "Sua próxima ideia pode ir mais longe.") e o formulário à direita (`signup-panel`, `max-width: 520px`). O `#signup-form` vira um **grid de 2 colunas**: matrícula+curso e senha+confirmação ficam lado a lado (`.field-duo`); os demais campos ocupam as duas colunas (`grid-column: 1 / -1`). Também há um `eyebrow` "Faça parte da comunidade" acima do `page-title`. Só muda o layout — o conteúdo é o mesmo do celular.

### 1.4. Recuperação de senha — `src/pages/recovery/recovery.html`

- **Título da aba:** `Recuperar acesso — PI²`
- **Chegada:** pelo link "Esqueci minha senha" do login.
- **Estrutura:** `topbar` → `page-icon` (chave) → `page-title` "Vamos recuperar seu acesso." → `page-lead` → formulário `#recovery-form` → cartão `steps-card` "Como funciona" (3 passos numerados) → `info-card` "Não encontrou a mensagem?" → botão outline "Voltar para o acesso".
- **Formulário:** apenas `E-mail institucional` + botão `btn-pi` "Enviar instruções" (com spinner e `submit-status`).
- **Validação:** sem `novalidate` → **nativa ativa** (`required` + `type="email"`).

### 1.5. Telas da área logada (explore · project · saved · profile)

Compartilham o mesmo **cabeçalho do app** (`app-header` com marca + avatar), a **navegação inferior fixa em 100% da largura** (`bottom-nav`: Explorar · Meus projetos · Salvos · Perfil) e os **cards de projeto** (`project-card`).

| Tela | Título da aba | Conteúdo principal |
| --- | --- | --- |
| **Explorar** | `Explorar projetos — PI²` | Saudação, barra de busca (única, só na página) + botão de filtro, chips de curso, destaque promocional, seções `Em destaque` e `Novas descobertas` + **modal de filtros** |
| **Detalhes** | `Rota Acessível — PI²` | Capa, tags, botão salvar, texto, equipe (`people`), arquivos (`files`), comentários e formulário |
| **Salvos** | `Projetos salvos — PI²` | Busca na coleção, cards com `Ver projeto` / `Remover dos salvos`, `Explorar mais projetos` |
| **Perfil** | `Meu perfil — PI²` | Cartão do usuário, dados institucionais (e-mail e curso travados), switches, lista de links, `Sair da conta` |

**Layout desktop da Explorar (≥ 992px):** o `app-header` e o `bottom-nav` viram `d-lg-none`; no lugar entra o `site-header` no "modo app" (`nav` "Explorar projetos" ativo/"Meus projetos", botão vermelho "Enviar projeto", sino e usuário `Ana Costa · Aluno`) e o `site-footer`. O conteúdo vira 2 colunas (`explore-layout`): barra lateral `explore-filters` (CURSO com contagens, ano, tipo de trabalho e cartão "Sua ideia também tem lugar aqui.") e a área de resultados (`explore-results`), com cabeçalho "1.248 projetos para descobrir" + ordenação, chips, **grade de 3 colunas com 6 `project-card`** (3 deles `d-none d-lg-block`) e paginação. A busca ganha o botão `Pesquisar projetos` (um `<form method="get">` — submete sem JS).

**Modal de filtros (`explore.html`):** a antiga tela `search` virou uma folha que **sobe de baixo pra cima** dentro da própria Explorar. **Um gatilho por breakpoint:** no celular, o botão vermelho de filtro ao lado da busca (→ `#busca`); no desktop, o ícone vermelho ao lado do título "Filtros" na barra lateral (mesmo alvo `#busca`, o outro gatilho é `d-lg-none`). A própria barra de busca é um `input` normal e existe **só na página** (não se repete dentro do modal). Fecha pelo backdrop, pelo × ou por `Mostrar 8 projetos` (→ `#topo`), tudo **só com CSS** (`:target`). Conteúdo: filtros ativos, resultados, rádios de curso, ano/ordenação, tipo de projeto e ações.

**Pendências desta área:**
- Botões de salvar/remover, switches (perfil) e envio de comentário são **inertes** (sem JS); chips e rádios do modal funcionam, mas não filtram de verdade.
- `Meus projetos` na navegação aponta para `#` (tela ainda não existe).

---

## 2. Estrutura de pastas

```
/
├── index.html                    ← tela de boas-vindas (entrada do site)
├── README.md · LICENSE
├── docs/                         ← esta documentação
├── .github/workflows/            ← guarda de ferramentas (CI)
└── src/
    ├── css/
    │   ├── tokens.css            ← variáveis de design + overrides do Bootstrap
    │   ├── base.css              ← elementos globais, acessibilidade, moldura .screen
    │   └── components.css        ← componentes reutilizados entre as telas
    └── pages/
        ├── welcome/
        │   └── welcome.css       ← só o que é da landing
        ├── login/
        │   ├── login.html
        │   └── login.css
        ├── signup/
        │   ├── signup.html
        │   └── signup.css
        └── pages/
            ├── welcome/
            │   └── welcome.css       ← só o que é da landing
            ├── login/
            │   ├── login.html
            │   └── login.css
            ├── signup/
            │   ├── signup.html
            │   └── signup.css
            ├── recovery/
            │   ├── recovery.html
            │   └── recovery.css
            ├── explore/              ← área logada (inclui o modal de busca)
            │   ├── explore.html
            │   └── explore.css
            ├── project/
            │   ├── project.html
            │   └── project.css
            ├── saved/
            │   ├── saved.html
            │   └── saved.css
            └── profile/
                ├── profile.html
                └── profile.css
```

**Regra de decisão:**

| Quero adicionar… | Vai para |
| --- | --- |
| Uma cor, raio, sombra nova | `src/css/tokens.css` |
| Uma regra de elemento global (`body`, `a`, foco) | `src/css/base.css` |
| Um componente usado por 2+ telas (botão, campo, card) | `src/css/components.css` |
| Algo que só 1 tela usa | `src/pages/<tela>/<tela>.css` |
| Uma tela nova | `src/pages/<tela>/<tela>.html` |
| O HTML da landing | `index.html` (raiz) |

---

## 3. Ordem de carregamento do CSS

Todo HTML carrega as mesmas 4 folhas, **nesta ordem** (a ordem é a cascata):

```html
<link rel="stylesheet" href="…/css/tokens.css" />
<link rel="stylesheet" href="…/css/base.css" />
<link rel="stylesheet" href="…/css/components.css" />
<link rel="stylesheet" href="…/css/<tela>.css" />
```

| # | Arquivo | Papel | Carrega antes porque… |
| --- | --- | --- | --- |
| 1 | `tokens.css` | variáveis (`:root`) e overrides do Bootstrap | os outros arquivos usam `var(--pi-*)` |
| 2 | `base.css` | reset, tipografia, foco, `prefers-reduced-motion`, moldura `.screen` | é o "piso" que tudo herda |
| 3 | `components.css` | botões, topbar, role cards, campos, info-card | precisa vencer o Bootstrap, mas ser vencido pela página |
| 4 | `src/pages/<tela>/<tela>.css` | exceções daquela tela | tem a última palavra |

Antes delas vêm, pela CDN: **Google Fonts** (Outfit + Work Sans) e **Bootstrap 5.3.3** (CSS).

**Caminhos relativos** (o erro mais comum):

| O HTML está em | CSS em `src/css/` | Home |
| --- | --- | --- |
| raiz (`index.html`) | `src/css/…` | — |
| `src/pages/<tela>/` | `../../css/…` | `../../../index.html` |

---

## 4. Variáveis CSS (`src/css/tokens.css`)

Todas vivem em `:root` e começam com `--pi-`.

### 4.1. Cores semânticas

| Variável | Valor | Papel | Onde aparece |
| --- | --- | --- | --- |
| `--pi-cream` | `#f6f2ec` | fundo das telas | `.screen` |
| `--pi-surface` | `#ffffff` | superfície de cards e campos | `.brand-card`, `.role-card`, `.pi-input` |
| `--pi-stage` | `#3c3b39` | fundo do "palco" (fora do frame) | `body` |
| `--pi-ink` | `#141110` | texto principal | `body`, títulos, `.btn-pi-outline` |
| `--pi-muted` | `#6b6560` | texto secundário | `hero-lead`, `page-lead`, `field-hint`, `info-card__text` |
| `--pi-border` | `#e5dfd6` | bordas de campos e cards | `.pi-input`, `.role-card` |

### 4.2. Vermelhos (escala da marca)

| Variável | Valor | Papel | Contraste |
| --- | --- | --- | --- |
| `--pi-red-900` | `#8e1410` | hover de link/botão | — |
| `--pi-red-700` | `#b31616` | **fundo dos botões** | 7:1 com branco (AA/AAA) |
| `--pi-red-600` | `#bc1c1c` | texto vermelho, links, foco | — |
| `--pi-red-500` | `#d93a2b` | grafismo/ícones | — |
| `--pi-red-50` | `#fdeeed` | tint (fundo de card selecionado/info) | — |

### 4.3. Formas e sombra

| Variável | Valor | Papel |
| --- | --- | --- |
| `--pi-radius` | `16px` | arredondamento padrão (cards, campos) |
| `--pi-radius-lg` | `24px` | arredondamento grande (brand-card, botões usam `14px`) |
| `--pi-shadow` | `0 24px 60px rgba(20,17,16,.18)` | sombra do palco/mockup |

### 4.4. Overrides do Bootstrap

| Variável | Valor | Efeito |
| --- | --- | --- |
| `--bs-primary` | `#b31616` | `.btn-primary`/`bg-primary` na cor da marca |
| `--bs-primary-rgb` | `179, 22, 22` | variantes com alfa (`.bg-primary-subtle` etc.) |
| `--bs-link-color` | `#bc1c1c` | links do Bootstrap na marca |
| `--bs-link-hover-color` | `#8e1410` | hover dos links |
| `--bs-body-font-family` | `"Work Sans", …` | fonte do corpo herdada do Bootstrap |

### 4.5. Como usar

```css
.meu-elemento {
  background: var(--pi-surface);      /* ✅ token */
  color: var(--pi-ink);
  border-radius: var(--pi-radius);
}

.meu-elemento:hover {
  border-color: #d5cdc1;              /* ❌ cor solta — prefira um token */
}
```

**Exceção atual (pendência):** cores de *hover/active* (`#d5cdc1`, `#d8d1c6`, `#efeae2`…) e os valores dentro das custom properties dos botões Bootstrap estão **literais**. Podem ser trocadas por `var(--pi-*)` sem quebrar nada — boa primeira tarefa em `components.css`.

### 4.6. Tipografia

| Uso | Fonte | Onde |
| --- | --- | --- |
| Display/títulos | **Outfit** (400–800) | `h1…h4`, `.topbar__title`, `.role-card__name`, `.section-title`, `.eyebrow` |
| Corpo | **Work Sans** (400–700) | `body` e textos |

Carregadas via Google Fonts no `<head>` de todas as telas.

---

## 5. Classes compartilhadas × específicas

### 5.1. `src/css/base.css` (elementos globais)

| Seletor | Papel |
| --- | --- |
| `*`, `body` | tap-highlight, fonte/cor/fundo base |
| `h1…h4`, `a`, `a:hover` | tipografia e links |
| `:where(a, button, input, [tabindex]):focus-visible` | **foco visível — regra de a11a, não remover** |
| `@media (prefers-reduced-motion: reduce)` | desliga animações para quem pediu menos movimento |
| `.screen` / `.screen--login` / `.screen__inner` | moldura: viewport inteira, frame de `max-width: 460px` |
| `@media (min-width: 768px)` | respiro extra em telas maiores |

### 5.2. `src/css/components.css` (reutilizados por 2+ telas)

| Grupo | Classes |
| --- | --- |
| Botões | `.btn-pi`, `.btn-pi-outline` |
| Barra superior | `.topbar`, `.topbar__title`, `.icon-btn`, `.icon-btn--filled`, `.icon-btn--ghost` |
| Cabeçalho de página | `.page-title`, `.page-lead`, `.eyebrow`, `.section-title`, `.screen-caption` |
| Cabeçalho do app | `.app-header` + `__caption` · `.app-brand` + `__mark __wordmark` · `.avatar` (+ `--sm`) |
| Navegação inferior | `.bottom-nav` · `.nav-item` + `__icon __label` (+ estados `.is-active`, `aria-current`) — **fixa, 100% da largura da tela**, sem `::after`; o conteúdo reserva espaço com `.screen__inner:has(.bottom-nav)` |
| Rótulos | `.field-label`, `.roles-legend`, `.field-hint` |
| Seleção de perfil | `.roles-fieldset`, `.role-card` + `__top __icon __name __check` + estados (`:hover`, `:has(input:checked)`, `:has(input:focus-visible)`) |
| Campos | `.pi-input` (+ modificadores `--plain`, `--select`), `.input-affix` |
| Chips | `.chip` (+ modificadores `--sm`, `--muted`, estado `.is-active`) · `.chip__remove` |
| Busca | `.search-bar` + `__icon` |
| Cabeçalho de seção | `.section-head` + `__title __link` · `.section-head__count` |
| Cards de projeto | `.project-card` + `__body __top __title __link __authors __meta` · `.thumb` (+ `--rounded --garden --campus --water`) |
| Feedback de envio | `.submit-status` (+ `.is-error` `.is-success`), `.spinner-border-sm` |
| Informativo | `.info-card` + `__icon __title __text` |
| Cabeçalho do site (desktop) | `.page-container` (container de 1280px, ≥ 992px) · `.site-header` + `__brand __logo __names __name __tagline __nav __cta` |
| Rodapé do site (desktop) | `.site-footer` + `__copy __nav` |
| Painel promocional (desktop) | `.promo-panel` + `__title __lead __photo __card __card-icon __card-title __card-text` — usado pelo **login e pelo cadastro** |

> **Desktop:** `site-header`, `site-footer`, `page-container` e `promo-panel` só se aplicam a partir de `992px` e são usados pela boas-vindas, pelo login, pelo cadastro e pela Explorar (por isso ficam em `components.css`). Abaixo desse breakpoint as telas seguem o layout de celular.

### 5.3. CSS de cada tela

| Arquivo | Classes |
| --- | --- |
| `welcome.css` | `.brand-card*` · `.welcome-hero` + `__copy __media __photo __note __note-icon __note-title __note-text` · `.hero-title` · `.hero-lead` · `.feature*` · `.hero-actions` · `.helper-text` · faixa de métricas `.stats-band*` · `.showcase*` — **e o layout desktop (≥ 992px) da landing** |
| `login.css` | `.login-layout` · `.login-panel` · `.remember-row` · `.remember-check` · `.forgot-link` · `.signup-row` · `.stack-form` (utilitário, hoje sem uso) |
| `signup.css` | `.required-mark` · `.terms-check` · `.signin-row` · `.signup-layout` · `.signup-panel` · `#signup-form` em grid + `.field-duo` (desktop) |
| `recovery.css` | `.page-icon` · `.steps-card*` · `.steps` · `.step*` (`__num __title __text`) |
| `explore.css` | `.explore-greet` · `.explore-title` · `.explore-search*` · `.explore-chips` · `.promo-card*` · **modal**: `.search-modal*` (`__backdrop __sheet __handle __head __title`) · `.active-filters` · `.results-count` · `.results` · `.filter-group*` · `.filter-radio*` · `.filter-chips` · `.filter-actions` · `.filter-clear` — **e o layout desktop (≥ 992px)**: `.explore-hero` + `__lead` · `.app-nav__*` (ações do app) · `.explore-layout` · `.explore-filters*` + `.explore-filters__cta*` · `.explore-results*` + `__sort __view` · `.explore-pagination*` + `.page-num*` |
| `project.css` | `.project-cover` · `.project-head` · `.project-title` · `.project-meta` · `.project-save` · `.project-text` · `.project-tags` · `.people` · `.person*` · `.files` · `.file*` · `.comments` · `.comment*` · `.comment-form*` |
| `saved.css` | `.saved-search` · `.card-actions*` · `.icon-btn--ghost.is-saved` · `.saved-more` |
| `profile.css` | `.user-card*` · `.profile-save` · `.setting-row*` · `.switch` · `.link-list` · `.link-row*` · `.profile-logout` |

> **Regra de promoção:** quando uma classe de página passa a ser usada por 2+ telas, ela sobe para `src/css/components.css` (ex.: `.eyebrow`, `.section-title`, `.field-hint`, `.screen-caption` vindos do welcome/signup).

---

## 6. Estado atual (sem JavaScript)

O `js/app.js` foi removido ("por enquanto"). O markup ficou no lugar para o JS voltar:

| Elemento | Situação hoje |
| --- | --- |
| Botão de mostrar/ocultar senha (login e cadastro) | **inerte** — clica e nada acontece |
| Spinner e `submit-status` (cadastro e recuperação) | **inertes** — nunca aparecem |
| `Entrar como aluno` (login) | ✅ **navega** para `explore.html` — é um link enquanto não houver JS |
| Rótulo "Entrar como aluno/professor" acompanhar o radio | **não acompanha** — fica no texto fixo do HTML |
| Validação do **cadastro** | ✅ **nativa do navegador** (sem `novalidate`) |
| Validação da **recuperação de senha** | ✅ **nativa do navegador** (`type="email"` + `required`) |
| Validação do **login** | ⚠️ **ativa no markup** (sem `novalidate`), mas irrelevante — o botão virou link e o form não submete |
| Envio do formulário | sem backend → a página só recarrega |
| Salvar/remover projeto (bookmark nos cards e no detalhe) | **inerte** — `aria-pressed` fixo no markup |
| Switches de notificação (perfil) | ✅ **funcionam** — `input[type=checkbox]` + CSS puro (sem persistência) |
| Comentários do projeto | formulário **inerte** — recarrega a página |
| Modal de filtros (explorar) | ✅ **abre e fecha** com `:target` (CSS puro) — um gatilho por breakpoint: no celular o botão ao lado da busca, no desktop o ícone ao lado de "Filtros" na lateral (ambos → `#busca`; fechar → `#topo`) |
| Busca da explorar (desktop) | ✅ **submete** — é um `<form method="get">` real; sem JS só recarrega a página com `?q=`, sem filtrar |
| Filtrar de verdade (resultados, chips, rádios) | **inerte** — atualiza a URL, mas não refiltra |
| Links `#` (Meus projetos, termos, ajuda) | tela/conteúdo ainda não existe |

**Pendência:** devolver o JS (ou ligar a um backend) antes de qualquer teste com usuário — hoje o login navega direto para a área logada sem checar credenciais.

---

*Última atualização: out/2026 — reflete a estrutura após a separação por telas e a criação do cadastro.*
