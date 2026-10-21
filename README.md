# PI² — Sistema de Gestão, Publicação e Validação de Projetos Integradores

> **Instituição:** FATEC Votorantim — Curso Superior de Tecnologia em **Desenvolvimento de Software Multiplataforma (DSM)**
> **Protótipo de Interface:** [Figma — PI²](https://www.figma.com/design/tfx1Huoex0774lj9QpqLXL/Untitled?node-id=5-6950&t=f8c9JjEtV2FquzTI-1)
> **Stack do Frontend:** HTML5 · CSS3 · JavaScript ES6+ · Bootstrap 5
> **Natureza:** Projeto Acadêmico Integrador

---

## Sumário

1. [Visão Geral e Propósito do Produto](#1-visão-geral-e-propósito-do-produto)
2. [Organograma de Perfis e Níveis de Acesso](#2-organograma-de-perfis-e-níveis-de-acesso)
3. [Regras de Negócio e Matriz Pedagógica (Curso DSM)](#3-regras-de-negócio-e-matriz-pedagógica-curso-dsm)
4. [Mapeamento do Protótipo (Figma) e Arquitetura das Telas](#4-mapeamento-do-protótipo-figma-e-arquitetura-das-telas)
5. [Arquitetura Técnica do Sistema](#5-arquitetura-técnica-do-sistema)
6. [Documento de Requisitos de Produto (PRD)](#6-documento-de-requisitos-de-produto-prd)

---

## 1. Visão Geral e Propósito do Produto

### 1.1. Identificação

| Campo | Descrição |
|---|---|
| **Nome do Projeto** | PI² (Plataforma Administrativa de Projetos Integradores) |
| **Domínio** | Gestão acadêmica e administrativa de Projetos Integradores |
| **Curso Atendido** | DSM — Desenvolvimento de Software Multiplataforma |
| **Instituição** | FATEC Votorantim |
| **Tipo de Aplicação** | Aplicação Web (SPA — *Single Page Application*) |
| **Foco de Acesso** | Área administrativa autenticada (acesso restrito por perfis / RBAC) |

### 1.2. Descrição do Produto

O **PI²** é uma aplicação web desenvolvida exclusivamente para a **gestão administrativa, acompanhamento, avaliação paritária, controle de matrículas/trilhas e validação dos Projetos Integradores (PI)** do curso de Desenvolvimento de Software Multiplataforma (DSM).

O sistema consolida em um único ambiente digital os processos que hoje são dispersos entre planilhas, documentos e comunicações informais:

- **Controle acadêmico dos alunos:** matrículas, trilha de disciplinas (chaves e satélites), carga horária acumulada de PI, histórico de participação em grupos e entrega de links técnicos.
- **Gestão de avaliação:** lançamento de notas por sala e por aluno, critérios de avaliação por disciplina/semestre, avaliação de desempenho docente e avaliação paritária entre coordenadores.
- **Acompanhamento institucional:** dashboards por persona, cronograma de bancas parciais e finais, relatórios analíticos (por data de ingresso) e relatórios gerenciais consolidados.
- **Voz do aluno:** canal estruturado para depoimentos e feedbacks sobre a experiência no PI.

### 1.3. Premissas de Acesso

O sistema **não possui área pública**. Toda funcionalidade está condicionada à autenticação prévia do usuário e à autorização decorrente do seu perfil (`role`) — modelo **RBAC (Role-Based Access Control)**:

| `role` | Perfil | Natureza do Acesso |
|---|---|---|
| `SECRETARIA` | Secretária / Direção | Administrativo-operacional (cadastros, atribuições e validações) |
| `COORDENADOR` | Professor Coordenador | Gerencial-pedagógico (critérios, avaliação docente, paritária, relatórios consolidados) |
| `PROFESSOR` | Professor de PI | Operacional-pedagógico (notas, critérios, relatórios analíticos) |
| `ALUNO` | Aluno do DSM | Consulta e autoatendimento (perfil, notas, cronograma, feedback) |

### 1.4. Fora de Escopo (v1)

Para garantir foco e viabilidade acadêmica, a versão 1 **não contempla**:

- Atendimento a cursos distintos do DSM;
- Aplicação pública/vitrine voltada a visitantes não autenticados.

---

## 2. Organograma de Perfis e Níveis de Acesso

### 2.1. Hierarquia de Perfis

A estrutura abaixo representa a hierarquia funcional dos perfis do sistema, do mais abrangente (administração institucional) ao mais específico (participante do PI):

```
DIREÇÃO / SECRETARIA (nível administrativo máximo)
│
├── PROFESSIONAL COORDENADOR (nível gerencial do curso DSM)
│   │
│   ├── PROFESSOR DE PI (nível operacional de sala/avaliação)
│   │
│   └── ALUNO (nível de consulta e autoatendimento)
│
└── ALUNO (também reporta-se à Secretaria para fins de matrícula e validação)
```

> **Nota de modelo de acesso:** a hierarquia acima indica **abrangência de permissões**, não subordinação corporativa. A Secretária/Direção possui o maior leque de ações cadastrais; o Coordenador concentra a autoridade pedagógica; o Professor de PI opera dentro dos critérios definidos pelo Coordenador; e o Aluno tem acesso somente a leituras e ações de autoatendimento sobre o próprio registro.

### 2.2. Matriz de Permissões por Persona

A tabela a seguir detalha as responsabilidades e permissões concedidas a cada perfil:

| # | Perfil | Responsabilidades Principais | Ações-Corrente no Sistema |
|---|---|---|---|
| 1 | **Secretária / Direção** | Gestão administrativa global do curso DSM | • Cadastrar alunos e professores<br>• Atribuir e gerenciar carga horária docente<br>• Definir a trilha de matrículas (disciplinas **chaves** e **satélites**)<br>• Realizar validações administrativas conforme a **data de ingresso** do aluno |
| 2 | **Prof. Coordenador** | Autoridade pedagógica e gerencial sobre o PI | • Definir e padronizar critérios gerais do curso DSM<br>• Avaliar o desempenho dos Professores de PI<br>• Aplicar a avaliação paritária entre coordenadores<br>• Acompanhar a evolução dos grupos<br>• Gerar relatórios consolidados do PI |
| 3 | **Professor de PI** | Execução das avaliações e acompanhamento de sala | • Registrar notas por sala e por aluno individualmente<br>• Definir critérios de avaliação específicos vinculados às disciplinas do semestre<br>• Emitir relatórios analíticos do PI<br>• Emitir relatórios de acompanhamento do aluno por **data de ingresso** |
| 4 | **Aluno** | Manutenção do próprio perfil e consulta acadêmica | • Atualizar o perfil (link do repositório no GitHub e portfólio digital)<br>• Consultar notas e critérios de avaliação por disciplina/sala<br>• Visualizar o cronograma de bancas<br>• Consultar carga horária acumulada de PI e status de disciplinas chaves/satélites<br>• Enviar depoimentos e feedbacks sobre a experiência no PI |

### 2.3. Detalhamento por Persona

#### 2.3.1. Secretária / Direção

A Secretária/Direção é a persona com o **maior alcance cadastral** do sistema. Sua atuação cobre o ciclo completo do aluno e do docente:

- **Cadastro de alunos:** inclusão, atualização e inativação de registros (nome, foto/avatar, e-mail, data de ingresso, links de GitHub e portfólio).
- **Cadastro de professores:** inclusão e manutenção dos docentes que atuam no PI.
- **Atribuição de carga horária docente:** definição da alocação de cada professor na orientação e/ou avaliação dos grupos de PI por semestre.
- **Trilha de matrículas:** configuração das disciplinas **chaves** e **satélites** que compõem o percurso pedagógico do curso DSM.
- **Validações administrativas:** conferência das condições de aproveitamento do PI conforme a **data de ingresso** do aluno (ex.: alunos ingressantes em determinado semestre seguem o planejamento daquela turma).

#### 2.3.2. Professor Coordenador

O Coordenador é a **autoridade pedagógica** do PI no curso DSM:

- **Critérios gerais:** definição e padronização dos critérios de avaliação aplicados a todos os grupos e disciplinas do PI.
- **Avaliação docente:** avaliação do desempenho dos Professores de PI sob sua coordenação (estrutura `coordinator_evaluations`).
- **Avaliação paritária:** participação no ciclo de avaliação entre pares-coordenadores (detalhado na seção 2.4).
- **Acompanhamento:** monitoramento da evolução dos grupos ao longo dos semestres (continuidade incremental).
- **Relatórios consolidados:** geração de relatórios gerenciais agregados (notas médias, evolução por turma, status de entregáveis e bancas).

#### 2.3.3. Professor de PI

O Professor de PI é a persona que **opera a avaliação em sala**:

- **Lançamento de notas:** registro de notas por sala (agrupamento turma) e por aluno individualmente, amarrado à estrutura `evaluations`.
- **Critérios específicos:** definição de critérios de avaliação específicos para as disciplinas do semestre em que atua, alinhados aos critérios gerais do Coordenador.
- **Relatórios analíticos:** emissão de relatórios detalhados do desempenho dos grupos e alunos sob sua responsabilidade.
- **Acompanhamento por ingresso:** emissão de relatórios que consideram a **data de ingresso** do aluno, permitindo comparar progressão entre turmas de coortes diferentes.

#### 2.3.4. Aluno

O Aluno é a persona com **acesso restrito ao próprio registro**, centrado em consulta e autoatendimento:

- **Perfil:** atualização dos links do repositório no GitHub e do portfólio digital.
- **Consulta acadêmica:** visualização de notas e critérios de avaliação por disciplina e por sala.
- **Cronograma:** visualização das datas, horários e salas das bancas parciais e finais.
- **Carga horária de PI:** consulta das horas acumuladas de PI e do status de aprovação nas disciplinas **chaves** e **satélites**.
- **Feedback:** envio de depoimentos e sugestões sobre a experiência vivida no Projeto Integrador.

### 2.4. Fluxo de Avaliação Paritária

A avaliação paritária é um processo estruturado composto por **dois fluxos distintos**, ambos sob responsabilidade do Coordenador:

- **Fluxo A — Coordenador → Professores de PI:** o Coordenador avalia o desempenho dos professores que orientam/avaliam os grupos.
- **Fluxo B — Coordenador → Coordenadores:** os coordenadores avaliam-se mutuamente (paritária entre pares).

#### Fluxo A — Coordenador avalia os Professores de PI

| Etapa | Agente | Ação | Resultado |
|---|---|---|---|
| 1 | Coordenador | Acessa o módulo de avaliação docente e seleciona o semestre vigente | Lista de Professores de PI do período exibida |
| 2 | Coordenador | Avalia cada professor individualmente (nota e observações) | Registro gravado em `coordinator_evaluations` com `evaluated_user_id` = professor |
| 3 | Sistema | Consolida as avaliações do semestre | Métricas agregadas disponíveis para relatório gerencial |
| 4 | Coordenador | Emite o relatório consolidado de desempenho docente | Relatório disponível para download/impressão |

#### Fluxo B — Avaliação Paritária entre Coordenadores

| Etapa | Agente | Ação | Resultado |
|---|---|---|---|
| 1 | Coordenador | Acessa o módulo de avaliação paritária e seleciona o ciclo vigente | Lista de pares-coordenadores do curso DSM exibida |
| 2 | Coordenador | Avalia cada coordenador par (nota e observações justificadas) | Registro gravado em `coordinator_evaluations` com `evaluator_id` = coordenador avaliador |
| 3 | Sistema | Consolida as avaliações entre pares | Média das avaliações recebidas por cada coordenador calculada |
| 4 | Coordenador | Consulta o consolidado da paritária (conforme regra institucional de visibilidade) | Relatório de paritária disponível para impressão/exportação |

> **Regra de negócio da paritária:** o ciclo só é encerrado quando **todos os coordenadores participantes** concluem suas avaliações. O sistema impede o fechamento do ciclo com avaliações pendentes, garantindo a completude do processo.

---

## 3. Regras de Negócio e Matriz Pedagógica (Curso DSM)

### 3.1. Regra de Continuidade do PI (DSM)

O Projeto Integrador do DSM segue o modelo de **Continuidade Total**, no qual o **mesmo projeto** é mantido e evoluído de forma incremental ao longo de todo o curso:

| Semestre | Edição | Característica da Evolução |
|---|---|---|
| 1º semestre | PI 1 | Concepção inicial: definição do problema, escopo mínimo viável e primeiras entregas |
| 2º semestre | PI 2 | Evolução incremental: ampliação de requisitos e consolidação da base do projeto |
| 3º semestre | PI 3 | Aprofundamento técnico: incorporação de novas disciplinas e tecnologias |
| 4º semestre | PI 4 | Maturação funcional: refatorações, testes e melhoria de qualidade |
| 5º semestre | PI 5 | Escala e integração: funcionalidades avançadas e integração entre módulos |
| 6º semestre | PI 6 | Consolidação final: entrega madura, documentação completa e preparação para defesa final |

**Implicações para o sistema:**

- O grupo de PI **permanece associado ao mesmo `project_name`** ao longo das edições, com incrementos registrados por `pi_semester`.
- O histórico de participação do aluno em cada edição é preservado (tabela `group_members`).
- As horas acumuladas de PI são contabilizadas somando-se as horas reconhecidas em cada edição (campo `accumulated_pi_hours`).

### 3.2. Disciplinas Chaves vs. Satélites (Trava de Aprovação)

O curso DSM organiza suas disciplinas em duas categorias que impactam diretamente a validação do PI:

| Categoria | Código (`type`) | Papel no PI | Exemplos |
|---|---|---|---|
| **Disciplina Chave** | `CHAVE` | Sustentam os fundamentos do projeto; **aproveitamento condicionado** à aprovação | Engenharia de Software, Desenvolvimento Web, Design Web, Banco de Dados, Programação de Aplicações |
| **Disciplina Satélite** | `SATELITE` | Complementam o escopo sem travar a validação do PI | Disciplinas de apoio, humanas ou optativas do semestre |

**Regra da Trava de Aprovação:**

1. A **aprovação nas disciplinas chaves** é **obrigatória** para a validação e o aproveitamento do PI no semestre correspondente.
2. O sistema verifica, por aluno e por semestre, o status de aprovação das disciplinas chaves antes de liberar o registro de aproveitamento do PI.
3. O status de disciplinas satélites é **registrado e exibido**, mas **não gera trava** sobre o aproveitamento do PI.
4. A Secretaria configura quais disciplinas de cada semestre são chaves e quais são satélites (campo `type` da entidade `subjects`).

### 3.3. Entregáveis do Projeto (Links Técnicos)

Cada grupo de PI deve manter atualizados, no mínimo, os seguintes **links técnicos obrigatórios**:

| Entregável | Descrição | Exemplos de Plataforma |
|---|---|---|
| **Repositório Oficial** | Código-fonte versionado do projeto | GitHub, GitLab, Bitbucket |
| **Live Preview / Deploy** | Aplicação rodando em ambiente de produção | Vercel, Netlify, Render |
| **Documentação Técnica** | Documentação oficial da API e do projeto | Swagger, Wiki do repositório, manuais |

**Regras de negócio associadas:**

- Os três links são **campos obrigatórios** na entidade `groups` (`github_repo`, `deploy_url`, `doc_url`).
- O não preenchimento ou a inoperância de um dos links gera **alerta de pendência** no dashboard do Coordenador e da Secretaria.
- Os links são exibidos no módulo de consulta de PIs e nos relatórios.

### 3.4. Atribuição de Horas e Registro Acadêmico

O sistema mantém o **registro acadêmico completo** da participação de cada aluno no PI:

| Conceito | Regra de Negócio | Entidade Envolvida |
|---|---|---|
| **Carga horária de PI** | Cada edição de PI concluída gera horas que são somadas ao acumulado do aluno | `students.accumulated_pi_hours` |
| **Controle de grupos** | O aluno é membro de um grupo por edição; o histórico de participações é preservado | `group_members` |
| **Histórico por edição** | Consulta de todos os PIs nos quais o aluno participou, com semestre e projeto | `group_members` + `groups.pi_semester` |
| **Planejamento semestral** | As disciplinas chaves são planejadas por **data de ingresso** do aluno (coorte) | `subjects.semester` + `students.entry_date` |
| **Validação por ingresso** | O aproveitamento do PI é conferido conforme o planejamento da turma de ingresso do aluno | `students.entry_date` + `subjects.type` |

---

## 4. Mapeamento do Protótipo (Figma) e Arquitetura das Telas

> **Referência visual:** [Protótipo no Figma](https://www.figma.com/design/tfx1Huoex0774lj9QpqLXL/Untitled?node-id=5-6950&t=f8c9JjEtV2FquzTI-1)
> A descrição abaixo mapeia cada tela administrativa do protótipo às funcionalidades correspondentes do sistema, respeitando a stack **HTML5 + CSS3 + JS ES6+ + Bootstrap 5**.

### 4.1. Dashboard / Visão Geral Logada (Por Persona)

| Aspecto | Detalhe |
|---|---|
| **Público** | Todos os perfis autenticados (conteúdo variável por persona) |
| **Layout Base** | *Sidebar* Bootstrap Colapsável + *navbar* superior + área de conteúdo com *cards* (`card`) e *badges* de status |
| **Conteúdo Secretaria** | Total de alunos ativos, professores cadastrados, alertas de cadastros incompletos, pendências de atribuição docente |
| **Conteúdo Coordenador** | Grupos por semestre, status de entregáveis, pendências de avaliação, evolução dos PIs, resumo de bancas |
| **Conteúdo Professor** | Salas/aulas atribuídas, pendências de lançamento de notas, próximas bancas |
| **Conteúdo Aluno** | Notas lançadas, horas acumuladas de PI, status de disciplinas chaves/satélites, próximo cronograma de bancas |
| **Alertas de Pendência** | *Toasts* e *badges* de alerta para entregáveis ausentes, avaliações pendentes e travas de disciplinas chaves |

### 4.2. Módulo de Gestão de Alunos e Trilha Acadêmica

| Aspecto | Detalhe |
|---|---|
| **Persona Responsável** | Secretária / Direção (escrita) · Coordenador e Professor (leitura) · Aluno (autoatualização de perfil) |
| **Layout** | Tabela responsiva Bootstrap (`table`) com busca, paginação e botões de ação; formulário em *modal* ou página dedicada |
| **Campos do Aluno** | Nome, foto/avatar, e-mail, **data de ingresso**, disciplinas chaves/satélites do semestre, planejamento semestral, horas acumuladas de PI, links de **GitHub** e **Portfólio Digital** |
| **Ações** | Cadastrar, editar, inativar, visualizar trilha acadêmica completa |
| **Regras Vinculadas** | Trava de aprovação em disciplinas chaves; contabilização de horas de PI; planejamento por coorte de ingresso |

### 4.3. Módulo de Atribuição Docente e Secretaria

| Aspecto | Detalhe |
|---|---|
| **Persona Responsável** | Secretária / Direção |
| **Layout** | Painel com formulário de atribuição (professor → grupo/PI → disciplina → carga horária) e tabela consolidada das atribuições vigentes |
| **Funcionalidades** | Cadastrar professores, atribuir professores a grupos de PI, definir carga horária semanal/total, reatribuir ou remover alocações |
| **Dados Gerenciados** | Vínculo professor–grupo, disciplinas associadas, carga horária alocada, semestre vigente |

### 4.4. Módulo de Avaliação e Critérios (Professores e Coordenadores)

Este módulo concentra **três sub-fluxos** de avaliação:

| Sub-fluxo | Persona | Layout | Funcionalidades |
|---|---|---|---|
| **Lançamento de notas por sala e por aluno** | Professor de PI | Grade de notas (tabela editável) com colunas por critério e linha por aluno; salvamento em *bulk* | Registrar notas por sala, ajustar nota individual, adicionar observações, consultar histórico |
| **Avaliação do Coordenador sobre o Professor de PI** | Coordenador | Formulário de avaliação com nota e campo de observações por professor | Avaliar desempenho docente, justificar nota, gerar relatório de desempenho |
| **Avaliação Paritária entre Coordenadores** | Coordenador | Lista de pares-coordenadores com formulário de avaliação individual | Avaliar cada par, justificar, acompanhar status de conclusão do ciclo |

**Estrutura de Critérios:**

- Os **critérios gerais** são definidos pelo Coordenador e aplicados a todas as disciplinas do PI.
- Os **critérios específicos** são definidos pelo Professor de PI para as disciplinas do semestre, herdando os critérios gerais como base.

### 4.5. Módulo de Grupos e Filtro de PIs

| Aspecto | Detalhe |
|---|---|
| **Persona Responsável** | Todos os perfis (escopo de visualização varia) |
| **Layout** | Barra de filtros (*selects* e *inputs* de busca) + *cards* ou tabela de resultados com *badges* de tecnologias e status |
| **Filtros Disponíveis** | Semestre do PI, nome do grupo, tecnologias utilizadas, disciplinas envolvidas |
| **Exibição do Grupo** | Nome do projeto, integrantes, semestre, tecnologias, status de entregáveis |
| **Links de Entregáveis** | Botões/ícones de acesso ao **Repositório GitHub**, **Live Preview** e **Documentação Técnica** (abertura em nova aba) |

### 4.6. Módulo de Bancas (Parciais e Finais)

| Aspecto | Detalhe |
|---|---|
| **Persona Responsável** | Secretária (cadastro/agendamento) · Coordenador e Professor (visualização/gestão) · Aluno (visualização do cronograma) |
| **Layout** | *Timeline* ou tabela de cronograma com *badges* de tipo (Parcial/Final), data, hora e sala |
| **Funcionalidades** | Cadastrar banca (grupo, tipo, data, sala), editar agendamento, exibir cronograma consolidado, notificar participantes |
| **Tipos de Banca** | `PARCIAL` (avaliação intermediária ao longo do semestre) e `FINAL` (encerramento da edição do PI) |

### 4.7. Módulo de Feedbacks e Depoimentos dos Alunos

| Aspecto | Detalhe |
|---|---|
| **Persona Responsável** | Aluno (escrita) · Coordenador e Secretaria (leitura/moderação) |
| **Layout** | Formulário de texto com classificação (estrelas ou *tags*) + *feed* de depoimentos anteriores |
| **Funcionalidades** | Enviar feedback sobre a experiência no PI, consultar histórico de feedbacks enviados, moderar/aprovar depoimentos (administração) |
| **Dados Armazenados** | Conteúdo do feedback, autor (`student_id`), data de criação |

### 4.8. Módulo de Relatórios e Exportação

| Aspecto | Detalhe |
|---|---|
| **Persona Responsável** | Professor (relatório analítico) · Coordenador (relatório gerencial consolidado) |
| **Layout** | Página dedicada com pré-visualização do relatório e botões de **impressão** e **exportação PDF** |
| **Relatório do Professor** | Gerado detalhadamente considerando a **data de ingresso** do aluno (coorte); inclui notas, critérios, disciplinas chaves/satélites e horas acumuladas de PI |
| **Relatório do Coordenador** | Relatório gerencial **consolidado** do curso DSM: métricas agregadas de todos os grupos, evolução por semestre, status de bancas e entregáveis |
| **Otimização de Impressão** | Folha de estilo dedicada (**Print CSS**) que remove navegação, botões e elementos de interface, garantindo impressão limpa **sem quebras indesejadas de página** (`page-break-inside: avoid` em blocos de conteúdo) |
| **Exportação PDF** | Geração de PDF a partir do diálogo de impressão nativo do navegador, com layout controlado pelo Print CSS |

---

## 5. Arquitetura Técnica do Sistema

### 5.1. Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Estrutura** | HTML5 | Semântica, acessibilidade e compatibilidade universal |
| **Estilo** | CSS3 + Bootstrap 5 | Grid responsivo, componentes prontos (modais, tabelas, formulários, navegação) e theming customizável |
| **Comportamento** | JavaScript ES6+ | Modularização com `const/let`, arrow functions, *template literals*, `async/await`, módulos ES (`import/export`) |
| **Persistência (protótipo/v1)** | LocalStorage / SessionStorage | Armazenamento client-side para prototipagem e demonstração sem backend |

> **Nota de arquitetura:** a versão 1 é uma **SPA client-side** com persistência local. A separação em camadas (ver seção 5.2) foi desenhada para facilitar a futura migração para uma API REST sem reescrever toda a lógica de negócio.

### 5.2. Arquitetura de Software — SPA Client-Side

A aplicação segue uma arquitetura em **camadas modulares** do lado do cliente, organizada em torno de controladores JavaScript especializados:

```
[ Camada de Apresentação ]
    HTML5 semântico + Bootstrap 5 + CSS3 customizado
            │
            ▼
[ Camada de Controladores (JS ES6+ módulos) ]
    authController · studentController · groupController ·
    evaluationController · defenseController · feedbackController · reportController
            │
            ▼
[ Camada de Serviços / Store ]
    AuthService · DataStore (abstração sobre LocalStorage/SessionStorage)
            │
            ▼
[ Camada de Persistência ]
    LocalStorage (dados persistentes) / SessionStorage (dados de sessão)
```

**Princípios adotados:**

| Princípio | Aplicação |
|---|---|
| **Separação de responsabilidades** | Cada controlador JS é responsável por um único domínio (alunos, grupos, avaliações etc.) |
| **Abstração de persistência** | O `DataStore` isla o acesso ao LocalStorage/SessionStorage, permitindo trocar o storage por uma API REST futuramente |
| **Guard de rota (RBAC)** | Todas as rotas da área logada passam por um verificador de sessão e de perfil antes da renderização |
| **Renderização dinâmica** | O HTML contém as *templates* e o JS ES6+ injeta dados via DOM API e *template literals* |

### 5.3. Autenticação e Autorização (RBAC)

| Conceito | Implementação |
|---|---|
| **Autenticação** | Formulário de login; credenciais validadas contra o *store* de usuários; sessão persistida em `SessionStorage` |
| **Autorização (RBAC)** | Cada rota/tela declara o perfil (`role`) exigido; o `authController` bloqueia o acesso se o perfil logado não corresponder |
| **Sessão** | Dados do usuário logado (`id`, `name`, `role`) mantidos em `SessionStorage` (expiram ao fechar a aba) |
| **Persistência de dados** | Registros de negócio (alunos, grupos, avaliações etc.) armazenados em `LocalStorage` |

### 5.4. Estrutura de Dados e Entidades

As entidades abaixo representam o **modelo de dados conceitual** do sistema, apresentadas em formato tabular. Cada entidade será implementada como um *array de objetos* no *store* client-side.

#### 5.4.1. Entidade `users`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único do usuário |
| `name` | string | Nome completo |
| `email` | string (unique) | E-mail de acesso/login |
| `password` | string | Senha (armazenada com hash na implementação real) |
| `role` | enum | `ALUNO` · `PROFESSOR` · `SECRETARIA` · `COORDENADOR` |
| `avatar_url` | string | URL da foto/avatar do usuário |

#### 5.4.2. Entidade `students`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único do aluno |
| `user_id` | number (FK → users) | Referência ao usuário vinculado |
| `entry_date` | date | **Data de ingresso** no curso (coorte) — usada em planejamento e relatórios |
| `github_url` | string | Link do repositório GitHub do aluno |
| `portfolio_url` | string | Link do portfólio digital do aluno |
| `accumulated_pi_hours` | number | **Carga horária acumulada de PI** em todas as edições |

#### 5.4.3. Entidade `courses`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único do curso |
| `code` | string | Código do curso — nesta versão, somente `DSM` |
| `name` | string | Nome completo — `Desenvolvimento de Software Multiplataforma` |

#### 5.4.4. Entidade `subjects`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único da disciplina |
| `course_id` | number (FK → courses) | Curso ao qual a disciplina pertence |
| `name` | string | Nome da disciplina (ex.: Engenharia de Software, Desenvolvimento Web, Design Web) |
| `type` | enum | `CHAVE` (trava de aprovação) · `SATELITE` (complementar) |
| `semester` | number | Semestre do curso em que a disciplina é oferecida (1 a 6) |

#### 5.4.5. Entidade `groups`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único do grupo |
| `pi_semester` | number | Semestre/edição do PI (1 a 6 — continuidade incremental) |
| `project_name` | string | Nome do projeto (constante ao longo das edições) |
| `github_repo` | string | **Link do Repositório Oficial** (GitHub/GitLab/Bitbucket) |
| `deploy_url` | string | **Link do Live Preview / Deploy** (Vercel/Netlify/Render) |
| `doc_url` | string | **Link da Documentação Técnica** (Swagger/Wiki/manuais) |
| `technologies` | string[] | Tecnologias utilizadas no projeto (para filtros) |

#### 5.4.6. Entidade `group_members`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único do vínculo |
| `group_id` | number (FK → groups) | Grupo ao qual o aluno pertence |
| `student_id` | number (FK → students) | Aluno integrante do grupo |

#### 5.4.7. Entidade `evaluations`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único da avaliação |
| `group_id` | number (FK → groups) | Grupo avaliado |
| `evaluator_id` | number (FK → users) | Usuário que avaliou (professor ou coordenador) |
| `student_id` | number (FK → students) | Aluno avaliado (**null** quando a nota é atribuída ao grupo inteiro) |
| `score` | number | Nota atribuída (0 a 10) |
| `criteria` | string | Critério de avaliação utilizado (critério geral ou específico) |
| `notes` | string | Observações do avaliador |

#### 5.4.8. Entidade `coordinator_evaluations`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único da avaliação |
| `evaluator_id` | number (FK → users) | Coordenador avaliador |
| `evaluated_user_id` | number (FK → users) | Usuário avaliado (Professor de PI ou Coordenador par) |
| `score` | number | Nota atribuída (0 a 10) |
| `notes` | string | Justificativa / observações |
| `cycle_type` | enum | `DESEMPENHO_DOCENTE` (Coordenador → Professor) · `PARITARIA` (Coordenador → Coordenador) |

#### 5.4.9. Entidade `feedbacks`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único do feedback |
| `student_id` | number (FK → students) | Aluno autor do depoimento |
| `content` | string | Conteúdo do feedback / depoimento |
| `rating` | number | Avaliação opcional (1 a 5) |
| `created_at` | datetime | Data e hora do envio |

#### 5.4.10. Entidade `defenses`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | number (PK) | Identificador único da banca |
| `group_id` | number (FK → groups) | Grupo que apresenta a banca |
| `type` | enum | `PARCIAL` · `FINAL` |
| `date` | date | Data agendada da banca |
| `time` | time | Horário da banca |
| `room` | string | Sala / local da apresentação |

---

## 6. Documento de Requisitos de Produto (PRD)

### 6.1. Requisitos Funcionais (RF)

| Código | Nome | Descrição | Persona | Prioridade |
|---|---|---|---|---|
| **RF01** | Autenticação e RBAC | Sistema de login com controle de acesso baseado em perfis (`ALUNO`, `PROFESSOR`, `SECRETARIA`, `COORDENADOR`). Rotas da área logada estritamente protegidas. | Todos | **Alta** |
| **RF02** | Dashboard por Persona | Painel administrativo personalizado conforme o perfil logado, com indicadores, alertas de pendências e atalhos para as ações mais frequentes. | Todos | **Alta** |
| **RF03** | Gestão de Alunos | Cadastro, edição, inativação e consulta de alunos (nome, avatar, e-mail, data de ingresso, links de GitHub e portfólio, horas acumuladas de PI). | Secretaria | **Alta** |
| **RF04** | Gestão de Professores e Atribuição Docente | Cadastro de professores e alocação de carga horária na orientação/avaliação dos grupos de PI por semestre. | Secretaria | **Alta** |
| **RF05** | Trilha Acadêmica e Disciplinas | Configuração das disciplinas chaves e satélites por semestre; planejamento semestral por data de ingresso do aluno. | Secretaria · Coordenador | **Alta** |
| **RF06** | Controle de Grupos e Horas de PI | Vinculação de alunos a grupos por edição do PI, contabilização automática de horas acumuladas e histórico de participação. | Secretaria · Professor | **Alta** |
| **RF07** | Gestão de Grupos e Entregáveis | Cadastro e edição de grupos de PI com nome do projeto, tecnologias e os três links obrigatórios (repositório, live preview, documentação). | Professor · Coordenador | **Alta** |
| **RF08** | Busca e Filtro de PIs | Consulta avançada de projetos com filtros por semestre, grupo, tecnologias e disciplinas envolvidas. | Todos | Média |
| **RF09** | Critérios de Avaliação | Definição de critérios gerais (Coordenador) e específicos por disciplina/semestre (Professor de PI). | Coordenador · Professor | **Alta** |
| **RF10** | Lançamento de Notas | Registro de notas por sala (em *bulk*) e por aluno individualmente, com observações e vínculo ao critério de avaliação. | Professor | **Alta** |
| **RF11** | Avaliação de Desempenho Docente | Avaliação do Coordenador sobre o desempenho dos Professores de PI, com nota e justificativa. | Coordenador | Média |
| **RF12** | Avaliação Paritária entre Coordenadores | Ciclo estruturado de avaliação entre pares-coordenadores, com consolidação de médias e status de conclusão. | Coordenador | Média |
| **RF13** | Gestão de Bancas | Cadastro, agendamento e exibição de cronograma de bancas parciais e finais (data, hora, sala, tipo, grupo). | Secretaria · Todos (leitura) | **Alta** |
| **RF14** | Feedbacks e Depoimentos | Canal para alunos enviarem opiniões, sugestões e depoimentos sobre a experiência no PI; moderação pela administração. | Aluno · Coordenador | Baixa |
| **RF15** | Relatórios e Exportação | Relatório do Professor (por data de ingresso) e Relatório do Coordenador (consolidado do curso DSM), otimizados para impressão (Print CSS) e exportação PDF. | Professor · Coordenador | **Alta** |

### 6.2. Requisitos Não Funcionais (RNF)

| Código | Nome | Descrição | Prioridade |
|---|---|---|---|
| **RNF01** | Segurança e RBAC | Todas as rotas da área logada devem ser estritamente protegidas por verificação de sessão e perfil. Nenhum conteúdo restrito pode ser acessível sem autenticação. | **Alta** |
| **RNF02** | Print CSS para Relatórios | Folha de estilo dedicada para impressão, removendo navegação, botões e elementos de UI, e garantindo **sem quebra indesejada de página** (`page-break-inside: avoid` em blocos de conteúdo). | **Alta** |
| **RNF03** | Performance e Responsividade | Interface responsiva (mobile/tablet/desktop) com Bootstrap 5; carregamento rápido sem dependência de frameworks JS pesados no frontend. | Média |
| **RNF04** | Integridade e Consistência de Dados | Validação de formulários no cliente, verificação de travas de disciplinas chaves e integridade referencial entre entidades no *store*. | Média |
| **RNF05** | Usabilidade e Acessibilidade | Navegação intuitiva com componentes Bootstrap acessíveis; contraste adequado, labels associados a campos e navegação por teclado. | Média |

---

## Licença

Este projeto está licenciado sob a licença [MIT](LICENSE).

---

*Documento técnico oficial — PI² · FATEC Votorantim · Curso DSM*
