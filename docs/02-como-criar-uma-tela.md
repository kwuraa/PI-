# Como criar uma nova tela — PI²

> **Tipo de documento:** How-to (receita — passo a passo para resolver um problema concreto).
> **Público:** devs do projeto, incluindo quem está começando.
> Antes de começar, vale olhar a [Referência](01-reference.md) (mapa das telas e variáveis) e o [porquê da arquitetura](03-arquitetura-e-design-system.md).

---

## Pré-requisitos

- Um editor de código (VS Code, por exemplo) e um navegador.
- Git configurado e o repositório clonado.
- **Não existe build** — o projeto é HTML/CSS puro. É só abrir o `index.html` no navegador.

```bash
cd "caminho/para/PI-"
open index.html
```

---

## Passo 1 — Criar a pasta da tela

Toda tela mora em `src/pages/<nome-da-tela>/` (nome em **inglês, minúsculo, kebab-case**).

```bash
mkdir -p src/pages/minha-tela
```

---

## Passo 2 — Criar o HTML

Crie `src/pages/minha-tela/minha-tela.html` começando por este esqueleto (é a estrutura real das telas atuais):

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Minha tela — PI²</title>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <!-- 1) tokens  2) base  3) componentes  4) a página (nesta ordem) -->
    <link rel="stylesheet" href="../../css/tokens.css" />
    <link rel="stylesheet" href="../../css/base.css" />
    <link rel="stylesheet" href="../../css/components.css" />
    <link rel="stylesheet" href="minha-tela.css" />
  </head>

  <body>
    <main class="screen">
      <div class="screen__inner">
        <!-- Barra superior -->
        <header class="topbar">
          <a class="icon-btn" href="../../../index.html" aria-label="Voltar">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </a>

          <h1 class="topbar__title">Minha tela</h1>

          <button
            class="icon-btn icon-btn--filled"
            type="button"
            aria-label="Mais opções"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="5" cy="12" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="19" cy="12" r="1.8" />
            </svg>
          </button>
        </header>

        <h2 class="page-title">Título da tela</h2>
        <p class="page-lead">Uma frase explicando o propósito desta tela.</p>

        <!-- conteúdo aqui -->

        <p class="mt-auto pt-4 mb-0 text-center">
          <a href="../outra-tela/outra-tela.html">Ir para outra tela</a>
        </p>
      </div>
    </main>
  </body>
</html>
```

**Pontos de atenção do esqueleto:**

- `.screen` + `.screen__inner` já dão a moldura de viewport inteira com frame de 460px — não crie `width`/`height` próprios.
- O `href` do "Voltar" é `../../../index.html` (três níveis: `src/pages/<tela>/` → raiz).
- Os 4 `<link>` de CSS vêm **depois** do Bootstrap e **nesta ordem**.

---

## Passo 3 — Criar o CSS da página

Crie `src/pages/minha-tela/minha-tela.css`:

```css
/* ============================================================
   PI² — Tela N — Minha tela
   ============================================================ */

.meu-bloco {
  /* use sempre as variáveis — nunca cores soltas */
  background: var(--pi-surface);
  color: var(--pi-ink);
  border-radius: var(--pi-radius);
}
```

**O que declarar aqui:** só o que **esta tela** usa.

**O que NÃO declarar aqui:** botões (`.btn-pi`), campos (`.pi-input`), role cards, `topbar`, `page-title`… — tudo isso já existe em `src/css/components.css` e é reaproveitado. Se um estilo for útil para 2 telas, ele sobe para `components.css`.

---

## Passo 4 — Ligar a nova tela nas outras páginas

Uma tela nova só vale alguma coisa se alguém chegar nela. Edite os HTML que devem apontar para ela:

```html
<!-- exemplo: dentro de index.html (está na raiz) -->
<a class="btn btn-pi w-100" href="src/pages/minha-tela/minha-tela.html">
  Ir para minha tela
</a>

<!-- exemplo: dentro de src/pages/login/login.html -->
<a href="../minha-tela/minha-tela.html">Minha tela</a>
```

Atalho de caminhos relativos:

| O HTML está em       | Para `src/pages/<outra>/`        | Para a home           |
| -------------------- | -------------------------------- | --------------------- |
| raiz (`index.html`)  | `src/pages/<outra>/<outra>.html` | —                     |
| `src/pages/<atual>/` | `../<outra>/<outra>.html`        | `../../../index.html` |

---

## Passo 5 — Testar no navegador

1. Abra o `index.html` e **navegue pelos botões** até a nova tela (não abra o arquivo novo direto — teste os links).
2. Abra o DevTools (`F12`) → modo dispositivo → teste **375px** e **430px**.
3. Veja a aba **Console/Network**: qualquer `404` em CSS significa caminho relativo errado.
4. Teste o foco com `Tab` (deve aparecer o contorno vermelho) e a validação nativa, se a tela tiver formulário.
5. Passe o mouse pelos botões/cards — os estados `:hover` devem responder.

---

## Passo 6 — Commitar (branch `dev`)

```bash
git checkout dev
git add src/pages/minha-tela index.html
git commit -m "feat(pages): tela de minha-tela"
git push
```

- **Produto** (HTML/CSS/docs) pode ir para o `main` via PR.
- **Ferramentas** (`.agents/`, `.trunk/`, `skills-lock.json`) **só no `dev`** — o hook local bloqueia e a Action `guarda-ferramentas` falha o PR se tentarem.

---

## Checklist de entrega

- [ ] Pasta em `src/pages/<nome>/` com `nome.html` + `nome.css`
- [ ] Os 4 links de CSS na ordem certa, com caminho relativo correto
- [ ] Reaproveita componentes de `components.css` (nada duplicado)
- [ ] Sem cores soltas — só `var(--pi-*)`
- [ ] Links de entrada/saída funcionando nas **duas** pontas
- [ ] Testado a 375px e 430px, sem `404` no console
- [ ] Foco visível (`Tab`) e contraste ok
- [ ] Commit na `dev` + push

---

## Erros mais comuns

| Sintoma                                                               | Causa provável                                                                                |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Página sem estilo                                                     | caminho do `<link>` errado (`../` a mais ou a menos)                                          |
| Voltar dá 404                                                         | `href` da home com caminho errado (são **3** `../`)                                           |
| Componente "quebra" ou fica sem estilo                                | você redeclarou uma classe de `components.css` na sua página — verifique a ordem dos `<link>` |
| Cor diferente do resto                                                | cor solta no lugar de `var(--pi-*)`                                                           |
| Commit recusado com "skills/agentes só são versionadas no branch dev" | você está fora do `dev` mexendo em `.agents/`/`.trunk/`                                       |
