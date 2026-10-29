# PI² — Repositório Acadêmico (Front-end)

> **Grandes ideias. Conhecimento que se conecta.**

O **PI²** é uma plataforma acadêmica onde alunos publicam e descobrem projetos
e professores orientam, revisam e aprovam. Este repositório contém o
**front-end estático** da aplicação, construído com **React + CSS puro**.

---

## 📌 Visão geral (para leigos)

Imagine um "catálogo de projetos" da faculdade: toda vez que um aluno cria um
projeto — de qualquer curso — ele é publicado lá dentro, com fotos, equipe,
entregáveis e nota final. Professores e coordenadores acompanham tudo por um
painel.

**O que existe hoje nesta fase:**

- ✅ Telas fiéis aos layouts aprovados (mobile-first)
- ✅ Navegação completa entre as telas
- ✅ Dados **falsos (mockados)**, no formato exato de uma API real
- ⏳ O back-end (servidor + banco de dados) chega no **próximo semestre**

Ou seja: por enquanto, nada aqui conversa com um servidor de verdade. Tudo é
simulado de dentro do próprio navegador — mas **de um jeito preparado** para a
troca imediata quando o back-end chegar (explicado na seção
[Como a API será integrada](#-como-a-api-será-integrada-no-próximo-semestre)).

---

## 🛠 Stack tecnológica

| Camada | Tecnologia | Por quê |
| --- | --- | --- |
| Framework | **React 18** | Componentização e reuso |
| Estilização | **CSS puro** (arquivos `.css` por componente) | Controle total do design system, sem dependências |
| Roteamento | **React Router 6** | Navegação entre páginas |
| Build/Dev server | **Vite 5** | Inicialização instantânea e build rápido |
| Dados | **Mocks locais** (`src/mocks`) | Simula a API enquanto o back-end não existe |
| Tipografia | **Work Sans** (Google Fonts) | Fonte definida nos designs |

---

## ▶️ Passo a passo para rodar localmente

### 1. Pré-requisitos

Você precisa ter instalado:

- **Node.js** versão 18 ou superior ([baixar](https://nodejs.org))
- Um editor de código (recomendado: [VS Code](https://code.visualstudio.com))
- Um terminal (no macOS: app *Terminal*; no Windows: *Prompt de Comando*)

Para verificar se já tem Node:

```bash
node --version
```

Se aparecer algo como `v18.x` ou superior, está tudo certo.

### 2. Baixar e instalar

```bash
# 1. Entre na pasta do projeto
cd PI-

# 2. Instale as dependências (só precisa fazer 1 vez)
npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O terminal mostrará algo como:

```text
  VITE v5.x.x  ready in 300 ms
  ➜  Local:   http://localhost:5173/
```

Abra **http://localhost:5173** no navegador. Pronto! 🎉

### 4. Comandos úteis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o app em modo desenvolvimento (com atualização ao salvar) |
| `npm run build` | Gera a versão otimizada para produção na pasta `dist/` |
| `npm run preview` | Visualiza localmente o que foi gerado pelo `build` |

---

## 📁 Estrutura de pastas

```text
src/
├── main.jsx              # Ponto de entrada do React
├── App.jsx               # Mapa de rotas (URL → tela)
│
├── pages/                # 🖥 TELAS (uma pasta por tela)
│   ├── WelcomePage/      # Boas-vindas
│   ├── LoginPage/        # Acessar o PI²
│   ├── DashboardPage/    # Painel unificado
│   └── PlaceholderPage/  # Genérica para telas futuras
│
├── components/           # 🧩 COMPONENTES REUTILIZÁVEIS
│   ├── ui/               # Peças visuais (Button, TextField, StatCard…)
│   ├── layout/           # Estruturas (TopBar, BottomNav, PageShell…)
│   └── icons/            # Todos os ícones SVG em um só lugar
│
├── services/             # 🔌 CAMADA DE DADOS (o "meio-termo" com a API)
│   ├── api.js            #   Requisições (hoje: mock | amanhã: fetch)
│   ├── authService.js    #   Login
│   └── dashboardService.js
│
├── mocks/                # 🎭 DADOS FALSOS no formato da API futura
│   └── apiMock.js
│
└── styles/               # 🎨 Estilos globais
    └── global.css        #   Reset + variáveis CSS (paleta, fontes, espaços)
```

### Regras de organização (DRY + Responsabilidade Única)

1. **Cada tela é uma pasta** em `pages/` com seu `.jsx` e seu `.css`.
2. **Cada componente é uma pasta** em `components/` com seu `.jsx` e seu `.css`.
3. **Nenhum estilo inline.** Todo CSS vive em arquivos separados, importados
   pelo respectivo componente.
4. **As páginas nunca importam mocks diretamente** — elas chamam `services/`.
5. **Cores, fontes e espaçamentos** vêm sempre das variáveis de
   `styles/global.css`, nunca valores "cruos" (`#hex`, `px` soltos).

---

## 🎨 Design system (variáveis CSS)

Tudo centralizado em `src/styles/global.css` como **Custom Properties**:

```css
:root {
  --color-bg: #f6f2ec;        /* fundo creme das telas */
  --color-surface: #ffffff;   /* cards e campos */
  --color-primary: #b31616;   /* vermelho dos botões */
  --color-ink: #141110;       /* texto principal */
  --color-muted: #6b6560;     /* texto secundário */
  --font-sans: 'Work Sans', sans-serif;
  /* … espaçamentos (--space-1..8), raios (--radius-*), tamanhos de texto … */
}
```

Para mudar a paleta do projeto inteiro, basta alterar essas variáveis em um
único arquivo.

### Mobile First

Os estilos partem da visão **mobile**. No rodapé de cada CSS há um bloco de
media query preparado para a versão desktop:

```css
@media (min-width: 768px) {
  /* … estilização desktop … */
}
```

---

## 🔌 Como a API será integrada (no próximo semestre)

A arquitetura foi desenhada para que a integração seja uma **simples troca**,
sem refatorar telas.

### Fluxo atual (fase estática)

```text
Página  →  services/authService  →  services/api  →  mocks/apiMock  ✅
```

### Fluxo futuro (com back-end)

```text
Página  →  services/authService  →  services/api  →  fetch(API)  →  Servidor 🖥
```

> Repare: **a página não muda**. Só `src/services/api.js` passa a usar `fetch`.

### Passos concretos quando o back-end estiver pronto

1. Crie um arquivo `.env` na raiz (pode copiar do `.env.example`):

   ```bash
   VITE_API_URL=https://api.suafaculdade.edu.br
   VITE_USE_MOCKS=false
   ```

2. Pronto. `src/services/api.js` já possui o ramo `if (USE_MOCKS) … else fetch(…)`.

3. Os mocks continuam úteis para testes e demonstrações — é só reativar
   `VITE_USE_MOCKS=true`.

---

## 🎭 Sobre os mocks (`src/mocks/apiMock.js`)

Os dados falsos seguem **o mesmo formato de resposta REST** que o back-end
devolverá:

```json
{
  "status": 200,
  "data": {
    "user": { "id": "usr-002", "name": "Rafael Moura", "initials": "RM" }
  }
}
```

Isso garante que, quando a API real assumir, **nenhum componente precise ser
alterado** — só a origem dos dados.

---

## 🗺 Mapa de rotas

| Rota | Tela | Status |
| --- | --- | --- |
| `/` | Boas-vindas | ✅ Implementada |
| `/acessar` | Acessar o PI² (login) | ✅ Implementada |
| `/painel` | Painel unificado | ✅ Implementada |
| `/explorar` | Explorar projetos | 🚧 Em breve (placeholder) |
| `/meus-projetos` | Meus projetos | 🚧 Em breve (placeholder) |
| `/salvos` | Projetos salvos | 🚧 Em breve (placeholder) |
| `/perfil` | Perfil e configurações | 🚧 Em breve (placeholder) |

---

## ✅ Boas práticas adotadas

- **Mobile first** com breakpoints preparados para desktop
- **Zero estilos inline** — CSS em arquivos dedicados
- **Design tokens** em variáveis CSS (paleta única e centralizada)
- **Componentização** com princípio da Responsabilidade Única
- **Camada de serviços** isolando dados da interface (preparada para API)
- **Acessibilidade**: labels associadas, `aria-*`, foco visível e
  `prefers-reduced-motion`
- **Segurança de toque**: alvos mínimos de 44px e `env(safe-area-inset)`

---

## 👥 Integrantes

Desenvolvido como projeto acadêmico (PI) — veja a lista de integrantes no
arquivo [`LICENSE`](./LICENSE).
