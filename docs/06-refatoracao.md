# 06 — Histórico de refatoração

Registro das melhorias de código aplicadas ao frontend **sem mudar o
comportamento nem a fidelidade visual** (o alvo são os prints em
[`prints/`](../prints)). Tudo passou por `npm run build` após cada etapa.

---

## Visão geral

| # | Etapa | Resultado |
| --- | --- | --- |
| 1 | Fonte única de status | `src/utils/status.js` |
| 2 | Hooks reutilizáveis | `useClickOutside`, `useCopyToClipboard` |
| 3 | Lista/ladrilho de arquivo | `ui/FileList` + `ui/FileRow` |
| 4 | Cabeçalho padrão | `ui/PageHeader` em 11 arquivos / 13 cabeçalhos |
| 5 | Split do `ProjectPage` | 581 → **201** linhas |
| 6 | Um componente por arquivo | **6 → 0** arquivos com >1 componente |
| 7 | `React.lazy` | 25 telas · bundle **509,76 → 379,74 kB** |

---

## 1. Fonte única de status — `src/utils/status.js`

O mapeamento `status → { label, tone, icon }` estava copiado em várias telas
(filtros, badges, botões). Virou um módulo puro:

```js
import { statusMeta, statusOptions, STATUS_VALUES } from '../utils/status.js';
statusMeta('publicado');   // → { label: 'Publicado', tone: 'success' }
statusOptions(['em-analise', 'publicado']);   // → opções de <Select>
```

Detalhes em [`05-mocks.md`](05-mocks.md).

## 2. Hooks — `src/hooks/`

| Hook | Papel |
| --- | --- |
| `useClickOutside(ref, handler)` | Fecha popovers/bottom sheets ao clicar fora |
| `useCopyToClipboard()` | Copiar labels de link para a área de transferência |

Extraídos de componentes que reimplementavam a mesma lógica.

## 3. Arquivos — `ui/FileList` + `ui/FileRow`

O ladrilho de arquivo (`FileRow`, com `LeadingIcon` próprio) e a lista
vertical (`FileList`) foram centralizados: a mesma markup de `<ul>` + flex
column estava repetida em várias telas (`styles.files`).

## 4. Cabeçalho padrão — `ui/PageHeader`

**11 arquivos / 13 cabeçalhos** de página divergiam só em `gap`,
`line-height` do título e no tipo de pill acima do `h1`. Todos passaram a
usar `<PageHeader/>`.

Props relevantes: `eyebrow`, `caps`, `title`, `lead`, `actions`, `actionsTop`,
`gap`, `split`, `className`.

Ver [`04-design-system.md`](04-design-system.md).

## 5. Split do `ProjectPage` — 581 → **201** linhas

A tela de detalhe concentrou estado e UI demais. Extraídos para
`src/components/project/`:

| Componente | Responsabilidade |
| --- | --- |
| `ProjectComments.jsx` + `.module.css` | **Todo** o estado de comentários: enviar, editar, excluir com confirmação, moderação. É auto-suficiente: lê `user`/`isRole` do contexto e recebe só `project`. |
| `ProjectSidebar.jsx` + `.module.css` | Coluna direita sticky: pílulas de status, card **Engajamento**, equipe e arquivos. |

O `<aside>` permanece no `ProjectPage` (é filho direto do grid `.layout`).

## 6. Um componente por arquivo — **6 → 0**

Era o último bloqueio para subcomponentes de página (SRP). Os 6 arquivos que
declaravam mais de um componente:

| Origem | Destino |
| --- | --- |
| `FileRow.LeadingIcon` | `ui/FileRow/LeadingIcon.jsx` + `.module.css` (4 classes) |
| `DeliveryPage.CalloutNotFound` | `staff/CalloutNotFound.jsx` |
| `App.RequireRole` / `App.StackShell` | `routing/RequireRole.jsx`, `routing/StackShell.jsx` |
| `ProfessorProjectPage.ProjectBlock` | `staff/ProjectBlock.jsx` + `.module.css` (25 classes + os 4 helpers `dateLineFor`, `actionFor`, `approvalNoteFor`, `TURMA`) — a página caiu para 84 linhas |
| 3 faces do `StaffPanelPage` | `staff/ProfessorFace`, `staff/CoordinatorFace`, `staff/UnifiedFace` + CSS próprio + `staffMetrics.js` — a página caiu para 37 linhas |
| 2 faces do `RelatorioConsolidadoPage` | `staff/SemesterReport`, `staff/CohortReport` + CSS próprio + `reportShared.js` — a página caiu para 36 linhas |

### CSS compartilhado entre faces

`.stats`, `.block`, `.card`, `.columns`… são usados por mais de uma face.
Em **vez de duplicar** as regras (o que a refatoração combate), criou-se um
módulo por feature:

- `components/staff/StaffPanelShared.module.css` — `.stats`, `.block`, `.blockTitle`
- `components/staff/ReportShared.module.css` — `.stats`, `.columns`, `.sideColumn`, `.card`, `.cardTitle`, `.cardNote`

**Ordem de importação importa:** o módulo compartilhado vem **antes** do da
face, para que as classes da face sobrescrevam as compartilhadas
(`.filterCard` sobrescreve o `gap` do `.card`; `.statsWide` sobrescreve o
grid do `.stats`). A ordem foi verificada no bundle gerado.

### Helpers partilhados

| Módulo | Exporta | Usado por |
| --- | --- | --- |
| `staff/staffMetrics.js` | `METRICS` (derivado de `REVIEW_QUEUE_IDS`, `ADVISED_GROUP_IDS`, `GROUPS`) | as 3 faces do painel |
| `staff/reportShared.js` | `REPORT_TITLE`, `handlePrint()` | as 2 faces do relatório |

## 7. Code splitting — `React.lazy`

As **25 telas** passaram a ser importadas por chunk:

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

- `RouteFallback` (`routing/RouteFallback.jsx` + `.module.css`): texto
  centrado com `role="status"` e `aria-live="polite"`, **sem animação**
  (não depende de motion, respeita `prefers-reduced-motion`).
- Síncrono no principal: layouts, guardas, contextos, mocks e o kit `ui/`.
- Condição: toda página precisa ter `export default` (verificado nas 25).
- Nenhum arquivo fora de `App.jsx` importa `pages/` → split completo.

---

## Correções de achados pré-existentes

Problemas que já existiam e foram corrigidos no caminho (impacto visual
nulo ou correção de bug real):

| Achado | Correção |
| --- | --- |
| **Refs mortas** `styles.X` em `WelcomePage`, `LoginPage`, `BottomNav` (classe não existia no CSS → `className="undefined"`) | referências removidas |
| `transformOrigin` em regra errada | movido para `.panel` |
| `.page` do `RelatorioConsolidadoPage` **definido mas nunca usado** (nenhum JSX passava `styles.page`) | regra removida — o espaçamento vem do stage da `MainLayout`; nada muda |

### Decisões deliberadas (não são bugs)

- **`ProjectStatusPage.jsx` tem 2 `<h1>`** — pré-existente e mantido: os dois
  estão em ramos de renderização **mutuamente excluíentes** (estado de sucesso
  "Enviado para análise!" × estado normal "Status do projeto"). Só um render
  por vez.
- **Sem wrapper em `RelatorioConsolidadoPage`** — a página devolve o fragmento
  da face direto, como no original. Adicionar um `<div class="page">` mudaria
  o DOM e o espaçamento.

---

## Verificações usadas

Executadas após cada etapa:

```bash
npm run build                                 # precisa passar SEM aviso >500 kB
grep -rn "style={{" src/                      # precisa retornar nada
python3 check_imports.py                      # 0 imports órfãos
python3 find_multicomponent.py                # 0 arquivos com >1 componente
# ref styles.X → existe no *.module.css correspondente   (0 órfãos)
# todo arquivo de página tem export default              (25/25)
```

Resultado final: **build OK · 0 imports órfãos · 0 refs de estilo órfãs ·
0 estilos inline · 0 multicomponente · 25 telas com `export default`.**

> Observação: `styles.files` em `FileList.jsx` aparece como "órfão" em
> verificações ingênuas porque está citado dentro do comentário JSDoc — é um
> falso positivo.

---

## Convenções consolidadas

1. JSDoc no topo de **todo** arquivo (`.jsx`, `.js`, `.module.css`), em pt-BR.
2. **Um componente por arquivo** (SRP).
3. **Nada de estilos inline** (`style={{ … }}` proibido).
4. CSS Modules por componente; compartilhado por feature importado **antes**.
5. Cores numéricas só em `variables.css` (exceção: `Logo.jsx`).
6. Ícones só de `react-icons/fi`.
7. Mobile-first, breakpoints 768 e 1024 px.
8. Animação só no conteúdo, **nunca** nas barras; variantes em
   `src/styles/motion.js`.
9. Dados nos mocks/contextos (DRY), nunca hardcoded em JSX.
10. Fidelidade aos prints de [`prints/`](../prints).
