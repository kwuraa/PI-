# Arquitetura e Design System — PI²

> **Tipo de documento:** Explanation (entender o porquê das decisões).
> **Público:** devs do projeto — inclusive quem chegou agora.
> Para consultar o que existe, vá para a [Referência](01-reference.md); para fazer algo, para o [How-to](02-como-criar-uma-tela.md).

---

## 1. Por que o HTML fica na raiz e os assets em `src/`

O `index.html` fica na **raiz** porque é a porta de entrada do site: hospedagem estática (GitHub Pages, Vercel, qualquer servidor) e duplo clique no arquivo esperam a home em `/`.

Todo o resto — CSS e telas — vive dentro de `src/` (de *source*, "código-fonte"). Isso deixa a raiz limpa: quem olha o repositório vê `index.html`, `README.md` e `src/`, e não precisa adivinhar onde procurar.

```
raiz  →  o que o navegador precisa para abrir o site
src/  →  o que os devs mantêm
```

Não há build, bundler ou transpiler. Isso é decisão, não descaso: o projeto é HTML/CSS puro de propósito — qualquer pessoa abre no navegador e vê o resultado, sem `npm install`.

---

## 2. Por que o CSS é dividido em 4 camadas

Originalmente existia um `styles.css` de 522 linhas. Ele foi fatiado em 4 folhas carregadas nesta ordem:

```
tokens.css  →  base.css  →  components.css  →  <tela>.css
```

A ordem **é** a arquitetura. Como o CSS resolve empate pela cascata (folha que vem depois vence), a sequência define a hierarquia:

| Camada | Conteúdo | Vence quem |
| --- | --- | --- |
| `tokens.css` | variáveis de design + overrides do Bootstrap | ninguém — só declara |
| `base.css` | reset, tipografia global, foco, moldura `.screen` | tokens (via `var()`) |
| `components.css` | botões, campos, cards, topbar | base e Bootstrap |
| `<tela>.css` | exceções de uma tela específica | **todos** |

O benefício prático: uma tela pode ajustar um componente **sem tocar no componente**. O `signup.css` pode dar um `margin-top` no `role-card` sem mudar nada para o login — e o componente continua sendo um só.

**Regra prática:** se um estilo serve para 2 ou mais telas, ele sobe de camada (da página para `components.css`; de `components.css` para `base.css`; cores/raios para `tokens.css`).

---

## 3. Por que variáveis e não cores soltas

```css
.btn-pi { background: var(--pi-red-700); }   /* ✅ token */
.btn-pi { background: #b31616; }             /* ❌ número mágico */
```

As variáveis (`--pi-*`, em `tokens.css`) são um **contrato de marca**:

- **Consistência** — o vermelho dos botões é o mesmo vermelho do link de foco porque ambos apontam para a mesma origem semântica.
- **Trocar o tema em um lugar só** — mudar `--pi-red-700` propaga para todos os botões do projeto de uma vez.
- **Semântica > hexadecimal** — `--pi-muted` diz "texto secundário"; `#6b6560` não diz nada. Quem lê o CSS entende a intenção sem consultar o Figma.
- **Contraste consciente** — os nomes documentam decisões de acessidade (`--pi-red-700`: contraste 7:1 com branco).

Além disso, as variáveis são usadas para **puxar o Bootstrap para a marca** (`--bs-primary`, `--bs-link-color`…): em vez de sobrescrever classes do Bootstrap uma a uma, o projeto reaproveita o sistema de theming deles. É por isso que o Bootstrap vem de CDN e não foi "ejectado".

**Estado atual e pendência:** cores de hover (`#d5cdc1`…) e os valores das custom properties dos botões Bootstrap ainda estão literais. São legítimas — o Bootstrap exige valores em `--bs-btn-bg`, que aceitam `var()` — mas são candidatas naturais a virarem tokens na primeira refatoração.

---

## 4. Por que cada tela tem sua própria pasta

```
src/pages/
├── welcome/   → welcome.css
├── login/     → login.html + login.css
├── signup/    → signup.html + signup.css
└── recovery/  → recovery.html + recovery.css
```

Telas como pastas, e não arquivos soltos (`login.html`, `login.css`, `cadastro.html`…), porque **HTML e CSS de uma tela são unidade de trabalho**. Quando alguém mexe no login, tudo que importa está numa pasta só — nada de caçar `login.css` numa pasta genérica `css/` com 8 folhas.

O fato de `welcome` não ter `welcome.html` não é inconsistência: a landing é o `index.html` da raiz, e a documentação explica esse desvio (seção 1). O `welcome.css` mora na pasta da tela porque o conteúdo é dela.

---

## 5. Por que não há JavaScript — ainda

O `js/app.js` foi removido "por enquanto". O markup que dependia dele (botões de olho, spinner, `submit-status`) **ficou no lugar**, inerte, de propósito: quando o JS voltar, ele só precisa religar seletores que já existem.

O que hoje é resolvido sem JS:

- **Seleção de perfil** — radio + `role-card:has(input:checked)`. CSS puro com `:has()` faz o trabalho de "seleção visual".
- **Validação do cadastro** — `required`, `minlength`, `pattern` do HTML nativo (o cadastro **não** tem `novalidate`).
- **Acessibilidade** — foco visível, `aria-label`, `prefers-reduced-motion`, `role="status"` já estão no markup/CSS.

O que **exigirá** JS quando voltar: mostrar/ocultar senha, spinner de carregamento, `submit-status`, envio real a um backend, e a validação do login (que hoje está desligada por `novalidate` — pendência conhecida, ver [Referência §6](01-reference.md)).

Decisão: **não inventar JS enquanto o CSS der conta**. Menos JS é menos superfície de bug e menos coisa para a banca perguntar "por que isso funciona assim?".

---

## 6. Branches `main` × `dev` e a guarda das ferramentas

O repositório separa **produto** de **ferramentamento de IA**:

| Branch | Conteúdo |
| --- | --- |
| `main` | só o produto: `.github`, `.gitignore`, `LICENSE`, `README.md`, `index.html`, `src/`, `docs/` |
| `dev` | produto + ferramentas: `.agents/` (skills), `.trunk/` |

Ferramentas fora do `main` porque a entrega é o site — um avaliador clonando `main` não deverá encontrar configuração de agente de IA.

Três camadas de proteção (porque o `.gitignore` **não basta**: ele esconde arquivos não rastreados, mas não impede o Git de trazer arquivos já versionados no `dev`):

1. **Hook local** (`.git/hooks/pre-commit` e `pre-merge-commit`) — bloqueia entrada de `.agents/`, `.trunk/` e `skills-lock.json` fora do `dev`; remoções são permitidas. Protege commits feitos na máquina.
2. **Action `guarda-ferramentas`** (`.github/workflows/guard-tooling.yml`) — roda em PRs e pushes para `main` e falha se os caminhos protegidos aparecerem. Protege merges feitos pela interface do GitHub, que ignoram hooks locais.
3. **`.gitignore`** — evita que os arquivos sejam recriados/acidentalmente rastreados no `main`.

Ainda não há branch protection/ruleset: a Action **sinaliza** (fica vermelha) mas não impede o merge. Se o projeto crescer para mais gente, ativar a ruleset no `main` exigindo esse check é o passo natural.

---

## 7. O design system em uma frase

**Swiss Modernism contemporâneo**: fundo creme, moldura branca de 460px simulando um mockup de celular, tipografia geométrica (Outfit + Work Sans), um único acento vermelho (`--pi-red-*`) e bordas suaves (`--pi-radius`). Toda decisão de CSS abaixo de `components.css` deve obedecer a essa frase — se um estilo novo briga com ela, provavelmente não é exceção de página: é erro de design system.

---

*Última atualização: out/2026.*
