# 05 — Mocks (fonte de dados)

Todo o conteúdo de tela vem de **dois arquivos** em `src/mocks/`. Editar
conteúdo **não exige tocar em JSX**.

---

## `src/mocks/projectsMock.js` (~21 kB)

Fonte de projetos, equipes, grupos e histórico.

### O que exporta

| Export | Conteúdo |
| --- | --- |
| `PROJECTS` | Array de projetos |
| `EQUIPE` | Membros por equipe (id `team-*`) |
| `GROUPS` | Grupos com `name`, `semester`, `semesterLabel`, `members`, `pendingDeliveries`, `pendingLabel`, `docsUrl` |
| `REVIEW_QUEUE_IDS` | Ids dos projetos na fila de revisão |
| `ADVISED_GROUP_IDS` | Ids de **equipe** (`team-*`) sob orientação |
| `getProjectBySlug(slug)` | Busca por `slug` (usado pelo `StackShell` para o título) |
| `getProjectsByIds(ids)` | Lista por id de **projeto** |
| `getTeam(project)` | Equipe do projeto |
| `teamDisplay(project, { publicView })` | Rótulo da equipe com regra **LGPD** |
| `COURSE_SHORT` | Rótulo curto do curso |
| `EVOLUTION` / etapas / evidências | Histórico e materiais |

### Campos de um projeto

```js
{
  id, slug, title, description, type, semester,
  status: 'rascunho' | 'em-analise' | 'publicado' | 'ajustes',
  submittedAt, publishedAt,          // datas por situação
  views, likes,                      // ESTADO INICIAL das métricas
  highlights: [...],                 // destaques
  tags: [...],                       // tecnologias
  image,                             // capa (JPG em public/img/)
  links: { live, repository, docs }, // { label, title, hint }
  files: [{ id, name, kind, size, version }],
  teamId,                            // id de EQUIPE (team-*) ← atenção
}
```

### ⚠️ Armadilha de `id`

`ADVISED_GROUP_IDS` guarda ids de **EQUIPE** (`team-*`), não de projeto.
Por isso o filtro correto é:

```js
// ✅ certo
const advised = PROJECTS.filter((p) => ADVISED_GROUP_IDS.includes(p.teamId));

// ❌ errado — devolve []
const advised = getProjectsByIds(ADVISED_GROUP_IDS);
```

Isso vale para `ProfessorProjectPage` e para `ProfessorFace`.

### Projetos existentes

| `slug` | Título | Status |
| --- | --- | --- |
| `rota-acessivel` | Rota Acessível: um campus para todos | publicado |
| `biblioteca-conectada` | Biblioteca Conectada: acervo digital | em análise |
| `aquasense` | AquaSense: monitoramento da água | em análise |
| `ecocampus` | EcoCampus: gestão de resíduos | rascunho |
| `horta-viva` | Horta Viva: cultivo e comunidade | publicado |
| `agua-em-foco` | Água em Foco: qualidade e território | publicado |

Imagens de capa (em `public/img/`): `rota-acessivel.jpg`, `horta-viva.jpg`,
`agua-em-foco.jpg`. Projetos **sem** `image` seguem sem banner.

### LGPD

```js
teamDisplay(project, { publicView: true })
// → "Equipe DSM — 4º Semestre"   (sem nomes)

teamDisplay(project)              // logado
// → "Ana Costa e Bruno Lima"
```

---

## `src/mocks/usersMock.js` (~3 kB)

### Perfis

| `id` | Nome | `roles` | Email |
| --- | --- | --- | --- |
| `usr-ana` | Ana Costa | `['aluno']` | `ana.costa@aluno.faculdade.edu.br` |
| `usr-rafael` | Rafael Martins (`prof. Rafael`) | `['professor','coordenador']` | `rafael.martins@faculdade.edu.br` |
| `usr-marta` | Marta Campos (`coordenadora Marta`) | `['coordenador']` | `marta.campos@faculdade.edu.br` |
| `usr-helena` | Helena Souza (`sec. Helena`) | `['secretaria']` (legado; mesmos acessos da coordenação) | `helena.souza@faculdade.edu.br` |

### Funções exportadas

| Função | Papel |
| --- | --- |
| `spaceLabelFor(roles)` | Rótulo do espaço no cabeçalho (ex.: `professor + coordenador` → "Espaço do professor e coordenador") |
| `spaceOptionsFor(user)` | Opções do seletor **Espaço ativo** do Perfil — devolve `null` se o usuário tem um só papel |
| `SPACE_OPTIONS` | Opções padrão (`aluno`, `professor`, `coordenador`) |

---

## Status — `src/utils/status.js`

**Fonte única** do mapeamento de status. Não duplique essas tabelas em
página nenhuma.

```js
import { statusMeta, statusOptions, STATUS_VALUES } from '../utils/status.js';

statusMeta('publicado');
// → { label: 'Publicado', tone: 'success' }
```

| Status | `label` | `tone` |
| --- | --- | --- |
| `rascunho` | Rascunho | `neutral` |
| `em-analise` | Em análise | `warning` |
| `publicado` | Publicado | `success` |
| `ajustes` | Ajustes solicitados | `primary` |

- `STATUS_VALUES` — array canônico (ordem do fluxo).
- `statusOptions([…])` — converte para `<option>`s de `<Select>`.

---

## Engajamento — `src/context/EngagementContext.jsx`

| Métrica | Regra | Persistência |
| --- | --- | --- |
| **Views** | +1 por **sessão** ao abrir `/projeto/:slug`; F5 não infla; fechar a aba libera | `sessionStorage` → `pi2.viewed` |
| **Curtidas** | Só **logados** curtem **projetos publicados**; a equipe dona **não** curte o próprio | `localStorage` → `pi2.engagement` |

Estado inicial: campos `views` e `likes` de cada projeto no mock.

---

## Como editar conteúdo

1. Abra `src/mocks/projectsMock.js` (projetos) ou `usersMock.js` (perfis).
2. Altere o campo — **sem tocar em JSX**.
3. `npm run dev` e confira nas telas.

Regras ao editar:

- Dados **exclusivamente do DSM** (curso, tecnologias, exemplos de PI por
  semestre).
- Mantenha os 4 status representados (é o que sustenta os filtros e o painel).
- Ao adicionar projeto: preencha `links` (os 3), `files` e `teamId`
  apontando para uma equipe existente.
- Totais do relatório consolidado derivam de `GROUPS` — adicionar grupo muda
  as métricas automaticamente (`staffMetrics.js`).
