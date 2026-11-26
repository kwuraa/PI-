# 01 — Visão geral

## O que é o PI²

O **PI²** é o **Projeto Integrador** do curso **DSM · Desenvolvimento de
Software**. A plataforma reúne os projetos dos alunos em quatro movimentos:

1. **O aluno publica** um projeto com três links (GitHub, versão navegável e
   documentação) e seus arquivos (relatório em PDF, protótipo em ZIP…).
2. **O professor revisa** com um checklist de critérios qualitativos, emite um
   parecer e marca como *Aprovado* ou *Ajustes solicitados*.
3. **A coordenação acompanha** os grupos, os entregáveis e a evolução
   consolidada por semestre e por coorte.
4. **A coordenação** mantém a base de cursos da instituição.

O projeto público é exibido em duas camadas de privacidade:

- **público (visitante)**: título, descrição, imagens, equipe anonimizada
  (`Equipe DSM — Xº Semestre`, regra **LGPD** via `teamDisplay(project, { publicView: true })`),
  curtidas e comentários (visíveis, mas a escrita exige login);
- **logado**: identidade da equipe, todos os links, arquivos internos
  (repositório e ZIP), histórico de revisão e ações.

## Escopo do protótipo

> **Não há backend.** Login, envios, revisões, uploads, aprovações e
> recuperação de senha são **simulados** com dados locais em `src/mocks/`
> e com `localStorage`/`sessionStorage` para as métricas de engajamento.

O que é simulado:

| Ação | Como funciona |
| --- | --- |
| Login / logout | Seleção de perfil em `AuthContext`; nenhum dado sai do navegador |
| Publicar projeto | Grava o formulário em memória e mostra a tela de status |
| Upload de evidências | Aceita o arquivo na UI, sem transmitir nada |
| Exportar PDF / imprimir | Chama `window.print()` (o PDF sai do motor de impressão do navegador) |
| Recuperar senha | Mostra o passo de sucesso sem enviar e-mail |
| Views e curtidas | Persistidas em `localStorage` (`pi2.engagement`) e `sessionStorage` (`pi2.viewed`) |

O que **não** existe de propósito: servidor, banco de dados, autenticação real,
envio de e-mail, geração de PDF própria.

## Personas e perfis

Três perfis de login simulados, todos em `src/mocks/usersMock.js`:

| Perfil | Usuário | Papéis | Espaço no cabeçalho |
| --- | --- | --- | --- |
| Aluno | **Ana Costa** | `aluno` | Espaço do aluno |
| Professor | **Rafael Martins** (`prof. Rafael`) | `professor` **+** `coordenador` | Espaço do professor e coordenador (unificado) |
| Coordenador | **Marta Campos** (`coordenadora Marta`) | `coordenador` | Espaço do coordenador |

Helena Souza (`secretaria`) permanece como usuário legado no mock, com os
mesmos acessos da coordenação — inclusive o cadastro de cursos.

Um usuário pode ter **mais de um papel** (`roles: [...]`). O Rafael Martins é
justamente o caso: ele é professor e coordenador, então o painel (`/painel`)
abre na **face unificada** com abas. No **Perfil** existe o seletor
**Espaço ativo**, que permite alternar entre os papéis disponíveis — é assim
que se vê o mesmo painel nas três variantes.

Os rótulos vêm de `spaceLabelFor(roles)` e as opções de troca de
`spaceOptionsFor(user)` (ambos em `usersMock.js`).

## Papéis e rotas

| Papel | Rotas exclusivas |
| --- | --- |
| `aluno` | `/aluno`, `/aluno/novo`, `/aluno/status/:slug` |
| `professor` | `/painel/revisar/:slug`, `/painel/resultado/:slug`, `/painel/meu-projeto` |
| `coordenador` | `/painel/grupos`, `/painel/relatorio-consolidado`, `/secretaria/cursos` |
| `secretaria` (legado) | `/secretaria/cursos` — mesmo acesso da coordenação |
| `professor` **ou** `coordenador` | `/painel`, `/painel/entregas`, `/painel/evolucao`, `/painel/entrega/:slug` |
| `logado` (qualquer) | `/perfil`, `/alterar-senha` |
| visitante | `/`, `/login`, `/cadastro`, `/recuperar-senha`, `/termos`, `/privacidade` |
| todos | `/explorar`, `/projeto/:slug`, `/ajuda`, `*` (404) |

A guarda é `RequireRole` (detalhes em [`02-arquitetura.md`](02-arquitetura.md)).

## Conteúdo do repositório

```
PI-/
├── README.md          # resumo de entrada: rodar, rotas, estrutura, regras
├── docs/              # esta documentação
├── prints/            # 75 screenshots (desktop + mobile) por persona
├── public/img/        # imagens de capa dos projetos (3 JPGs)
├── src/               # todo o código
├── vite.config.js
└── package.json
```

## Mapa de prints (`prints/`)

Cada persona tem uma pasta com `desktop/` e `mobile/`. Os nomes indicam a
tela:

| Pasta | Prints | Telas cobertas |
| --- | --- | --- |
| `01-visitante` | 11 | boas-vindas, login, cadastro, recuperação, termos, privacidade, explorar (+ filtros), projeto público, ajuda, 404 |
| `02-aluno` | 7 | meus projetos, novo projeto, status (2 estados), projeto logado, perfil, alterar senha |
| `03-professor` | 9 | painel, entregas, entrega detalhe, revisar, resultado (aprovado + ajustes), evolução, meu projeto, perfil |
| `04-coordenador` | 7 | painel, grupos, relatório consolidado, evolução, entregas, entrega detalhe, perfil |
| `05-secretaria` | 3 | cursos, modal de cursos, perfil (pasta de prints legada; tela hoje é da coordenação) |

Esses prints são a **referência de fidelidade visual** do protótipo.

## Dados do domínio

- **6 projetos** com status distintos (cada status é representado ao menos uma
  vez): `rota-acessivel` (publicado), `biblioteca-conectada` (em análise),
  `aquasense` (em análise), `ecocampus` (rascunho), `horta-viva` (publicado),
  `agua-em-foco` (publicado) + entradas de status `ajustes`/`em-analise`/
  `publicado` na fila de revisão.
- **6 equipes** (`team-*`): `team-rota`, `team-biblioteca`, `team-aquasense`,
  `team-ecocampus`, `team-horta`, `team-agua`.
- **4 status canônicos**: `rascunho`, `em-analise`, `publicado`, `ajustes`
  (fonte única em `src/utils/status.js`).

> Todos os dados são **exclusivamente do DSM** (curso, tecnologias e exemplos
> de PI por semestre) — mantenha essa regra ao editar os mocks.
