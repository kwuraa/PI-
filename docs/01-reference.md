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
| **Explorar projetos** (área logada) | `src/pages/explore/explore.html` | explore | busca → search · cards → project · avatar/nav → saved, profile |
| **Resultados e filtros** | `src/pages/search/search.html` | search | `Voltar` → explore · card → project |
| **Detalhes do projeto** | `src/pages/project/project.html` | project | `Voltar`/nav → explore · nav → saved, profile |
| **Projetos salvos** | `src/pages/saved/saved.html` | saved | `Ver projeto` → project · `Explorar mais` → explore · nav → profile |
| **Perfil e configurações** | `src/pages/profile/profile.html` | profile | `Alterar senha` → recovery · `Sair da conta` → `index.html` · nav → explore, saved |

### 1.1. Boas-vindas — `index.html`

- **Título da aba:** `PI² — Grandes ideias. Conhecimento que se conecta.`
- **Conteúdo:** marca (logo em SVG + wordmark), `eyebrow` "Repositório acadêmico", `hero-title`, `hero-lead`, um bloco `feature` e dois botões (`btn-pi` e `btn-pi-outline`).
- **Rodapé:** `screen-caption` — "PI² · Ideias que multiplicam conhecimento".
- **Por que fica na raiz:** é a página inicial do site — o GitHub Pages/qualquer hospedagem estática exige `index.html` na raiz.

### 1.2. Login — `src/pages/login/login.html`

- **Título da aba:** `Acessar o PI²`
- **Estrutura:** `topbar` (voltar · título · menu) → `page-title` "Bom ter você aqui." → `page-lead` → formulário `#login-form`.
- **Formulário:** seleção de perfil (radio cards **Aluno/Professor**, `role-card`) · `E-mail institucional` · `Senha` com botão de mostrar/ocultar · `remember-row` (lembrar + esqueci) · `Entrar como aluno` · `info-card`.
- **`Entrar como aluno` hoje é um `<a>`** para `../explore/explore.html` (área logada), com as classes de botão — sem JS o `<button type="submit">` não navegava. Quando o JS voltar, vira `<button type="submit">` de novo (com spinner e `submit-status`).
- **Rodapé:** `signup-row` — "Ainda não tem conta? Criar conta".
- **⚠️** a validação nativa está ativa (sem `novalidate`), mas o form não submete: `Entrar como aluno` é um link (ver seção 6).

### 1.3. Cadastro — `src/pages/signup/signup.html`

- **Título da aba:** `Criar conta — PI²`
- **Estrutura:** `topbar` → `page-title` "Suas ideias começam aqui." → `page-lead` → formulário `#signup-form`.
- **Formulário:** seleção de perfil (`role-card`) · **Seus dados**: nome, e-mail institucional, matrícula, curso (select), período (select) · **Crie sua senha**: senha e confirmação (ambas com botão de olho) · aceite dos `terms-check` · botão `btn-pi` "Criar conta de aluno" · `info-card` de vínculo institucional.
- **Rodapé:** `signin-row` — "Já tenho conta · Entrar".
- **Validação:** sem `novalidate` → a **validação nativa do navegador está ativa** (`required`, `minlength="8"`, `pattern` na matrícula, selects com placeholder desabilitado).

### 1.4. Recuperação de senha — `src/pages/recovery/recovery.html`

- **Título da aba:** `Recuperar acesso — PI²`
- **Chegada:** pelo link "Esqueci minha senha" do login.
- **Estrutura:** `topbar` → `page-icon` (chave) → `page-title` "Vamos recuperar seu acesso." → `page-lead` → formulário `#recovery-form` → cartão `steps-card` "Como funciona" (3 passos numerados) → `info-card` "Não encontrou a mensagem?" → botão outline "Voltar para o acesso".
- **Formulário:** apenas `E-mail institucional` + botão `btn-pi` "Enviar instruções" (com spinner e `submit-status`).
- **Validação:** sem `novalidate` → **nativa ativa** (`required` + `type="email"`).

### 1.5. Telas da área logada (explore · search · project · saved · profile)

Compartilham o mesmo **cabeçalho do app** (`app-header` com marca + avatar), a **navegação inferior** (`bottom-nav`: Explorar · Meus projetos · Salvos · Perfil) e os **cards de projeto** (`project-card`).

| Tela | Título da aba | Conteúdo principal |
| --- | --- | --- |
| **Explorar** | `Explorar projetos — PI²` | Saudação, busca + botão de filtro, chips de curso, destaque promocional, seções `Em destaque` e `Novas descobertas` |
| **Resultados** | `Buscar projetos — PI²` | Chips de filtro ativo (removíveis), contagem, lista compacta e **painel inferior** `filter-sheet` (curso/ano/ordenação/tipo) |
| **Detalhes** | `Rota Acessível — PI²` | Capa, tags, botão salvar, texto, equipe (`people`), arquivos (`files`), comentários e formulário |
| **Salvos** | `Projetos salvos — PI²` | Busca na coleção, cards com `Ver projeto` / `Remover dos salvos`, `Explorar mais projetos` |
| **Perfil** | `Meu perfil — PI²` | Cartão do usuário, dados institucionais (e-mail e curso travados), switches, lista de links, `Sair da conta` |

**Pendências desta área:**
- O painel de filtros da tela de busca está **sempre visível** — abrir/fechar exige JS.
- Botões de salvar/remover, switches e envio de comentário são **inertes** (sem JS).
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
            ├── explore/              ← área logada
            │   ├── explore.html
            │   └── explore.css
            ├── search/
            │   ├── search.html
            │   └── search.css
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
| Navegação inferior | `.bottom-nav` · `.nav-item` + `__icon __label` (+ estados `.is-active`, `aria-current`) |
| Rótulos | `.field-label`, `.roles-legend`, `.field-hint` |
| Seleção de perfil | `.roles-fieldset`, `.role-card` + `__top __icon __name __check` + estados (`:hover`, `:has(input:checked)`, `:has(input:focus-visible)`) |
| Campos | `.pi-input` (+ modificadores `--plain`, `--select`), `.input-affix` |
| Chips | `.chip` (+ modificadores `--sm`, `--muted`, estado `.is-active`) · `.chip__remove` |
| Busca | `.search-bar` + `__icon` |
| Cabeçalho de seção | `.section-head` + `__title __link` · `.section-head__count` |
| Cards de projeto | `.project-card` + `__body __top __title __link __authors __meta` · `.thumb` (+ `--rounded --garden --campus --water`) |
| Feedback de envio | `.submit-status` (+ `.is-error` `.is-success`), `.spinner-border-sm` |
| Informativo | `.info-card` + `__icon __title __text` |

### 5.3. CSS de cada tela

| Arquivo | Classes |
| --- | --- |
| `welcome.css` | `.brand-card*` · `.hero-title` · `.hero-lead` · `.feature*` · `.helper-text` |
| `login.css` | `.remember-row` · `.remember-check` · `.forgot-link` · `.signup-row` · `.stack-form` (utilitário, hoje sem uso) |
| `signup.css` | `.required-mark` · `.terms-check` · `.signin-row` |
| `recovery.css` | `.page-icon` · `.steps-card*` · `.steps` · `.step*` (`__num __title __text`) |
| `explore.css` | `.explore-greet` · `.explore-title` · `.explore-search*` · `.explore-chips` · `.promo-card*` |
| `search.css` | `.search-title` · `.active-filters` · `.results-count` · `.results` · `.sheet-backdrop` · `.filter-sheet*` · `.filter-group*` · `.filter-radio*` · `.filter-chips` |
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
| Painel de filtros (busca) | **sempre aberto** — abrir/fechar exige JS |
| Links `#` (Meus projetos, termos, ajuda) | tela/conteúdo ainda não existe |

**Pendência:** devolver o JS (ou ligar a um backend) antes de qualquer teste com usuário — hoje o login navega direto para a área logada sem checar credenciais.

---

*Última atualização: out/2026 — reflete a estrutura após a separação por telas e a criação do cadastro.*
