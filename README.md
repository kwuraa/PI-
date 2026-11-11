# PI² — Repositório Acadêmico

Front-end do **PI²**, plataforma que reúne os **Projetos Integradores** do curso
**DSM · Desenvolvimento de Software**. Os alunos publicam entregas por links,
professores revisam com critérios qualitativos, a coordenação acompanha os
grupos e a secretaria gerencia os cursos.

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

## 🧭 Rotas principais

| Rota | Tela | Quem acessa |
| --- | --- | --- |
| `/` | Boas-vindas + vitrine pública (busca, semestre, cards anônimos) | visitante |
| `/login` | Acesso com 4 perfis simulados | visitante |
| `/cadastro` | Cadastro institucional (curso travado no DSM) | visitante |
| `/recuperar-senha` | Recuperação de senha simulada | visitante |
| `/explorar` | Busca + filtros em bottom sheet | todos |
| `/projeto/:slug` | Detalhe do projeto (público anônimo / logado completo) | todos |
| `/aluno` | Meus projetos | aluno |
| `/aluno/novo` | Publicação com **3 links** (GitHub, Live Preview, Docs) | aluno |
| `/aluno/status/:slug` | Acompanhamento da análise (etapas qualitativas) | aluno |
| `/painel` | Painel professor / coordenador / unificado (com abas) | equipe |
| `/painel/revisar/:slug` | Revisão com checklist + parecer | professor |
| `/painel/resultado/:slug` | Desfecho: aprovado ou ajustes (`?decisao=ajustes`) | professor |
| `/painel/entrega/:slug` | Detalhe da entrega + upload de evidências | professor/coordenador |
| `/painel/evolucao` | Histórico e evolução do grupo (relatório) | professor/coordenador |
| `/painel/grupos` | Gestão de grupos + link de documentação | coordenador |
| `/painel/meu-projeto` | Projeto sob orientação + materiais | professor |
| `/secretaria/cursos` | Cadastro de cursos (modal) | secretaria |
| `/perfil` | Dados, notificações, espaço ativo e logout | logado |

**Perfis do login (mock):** Aluno (Ana Costa), Professor (Rafael Martins —
também coordena, use **Espaço ativo** no Perfil para ver o painel unificado),
Coordenador (Marta Campos) e Secretaria (Helena Souza).

---

## ✏️ Como editar os dados (mocks)

Todo o conteúdo de tela vem de dois arquivos — **sem tocar em JSX**:

- **`src/mocks/projectsMock.js`** — projetos, equipes, grupos, evolução,
  etapas de análise e evidências. Altere títulos, descrições, status
  (`rascunho | em-analise | publicado | ajustes`), semestres, tecnologias,
  comentários e pareceres.
  - `teamDisplay(project, { publicView })` aplica a **LGPD**: em vistas
    públicas a equipe aparece só como `Equipe DSM — Xº Semestre`.
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
--color-primary: #b80000;   /* vermelho dos botões/links/ativos */
--color-bg-page: #fafafa;   /* fundo das páginas */
--font-family: 'Inter', …;  /* tipografia */
```

Regras do projeto:

- **Nada de estilos inline** (`style={{ … }}` é proibido);
- cada componente importa o **próprio** `*.module.css` (CSS Modules);
- cores numéricas só existem em `variables.css` (o logo, em
  `src/components/icons/Logo.jsx`, é a única exceção — é a marca);
- ícones vêm de **`react-icons`** (`react-icons/fi` — traço fino dos
  protótipos).

---

## 📁 Estrutura de pastas

```
src/
├── main.jsx            # entrada: monta React + Router + AuthProvider
├── App.jsx             # rotas, guardas RBAC (RequireRole) e layouts
├── styles/             # tokens globais (variables.css) + reset.css
├── mocks/              # dados simulados (projetos/usuários) — edite aqui
├── context/            # AuthContext: login, logout, espaço ativo, papéis
├── utils/              # helpers puros (formatação de datas/números)
├── components/
│   ├── ui/             # kit genérico: Button, Card, Modal, Badge, Select,
│   │                   # TextField, Avatar, Tabs, Callout, StatCard,
│   │                   # ListRow, SectionHeader, FilterChips, SearchField
│   ├── layout/         # TopBar, BottomNav, MainLayout, PublicLayout
│   ├── public/         # ProjectCard (variantes pública/logada/minha)
│   └── icons/          # Logo oficial (SVG da marca)
└── pages/              # uma pasta por área: public/, aluno/, staff/,
                        # secretaria/ + páginas raiz (Explore, Profile…)
```

**Convenções:** JSDoc no topo de todo componente/CSS; um componente por
arquivo (SRP); dados compartilhados vivem nos mocks ou no contexto (DRY);
mobile-first com breakpoints 768px e 1024px; animações (framer-motion,
`motion.div` + `AnimatePresence`) acontecem apenas no conteúdo
(`MainLayout`/`PublicLayout`) — nunca nas barras (TopBar/BottomNav) — com
stagger no hero, cascata nos cards, escala no toque de botões/chips e pílula
deslizante nas abas; variantes centralizadas em `src/styles/motion.js`.
