---
name: software-architecture
description: Escolhe e aplica arquitetura para consolidar software — limites, acoplamento, coesão, monolito vs serviços, e quando usar DDD, Clean, CQRS ou eventos. Use ao desenhar sistema, refatorar estrutura, revisar camadas, decidir split de módulos ou quando o usuário pedir arquitetura de software.
---

# Arquitetura de software

Arquitetura é o conjunto de **limites que custam caro de mudar**. Consolide deixando o domínio explícito e o I/O na borda — não copiando um diagrama de camadas em todo CRUD.

Antes de impor um estilo: `project-discovery`. O código e os times vencem o livro.

## Resultado esperado

- Limites nomeados (módulo, contexto, processo) com regras de dependência.
- Mudança de regra de negócio não exige reescrever HTTP/DB/UI juntos sem necessidade.
- Complexidade **acidental** cai; a essencial fica no domínio.
- Estilo escolhido **cabe no time** (não o contrário).

## Diagnóstico

1. O domínio é o centro do risco, ou o risco é I/O/ops?
2. Um time ou vários com cadências diferentes?
3. Um deploy ou muitos?
4. Leituras e escritas têm modelos muito distintos?
5. Já existe linguagem ubíqua e contextos, ou é CRUD estável?

Se o domínio for incerto e o time pequeno: **modularize o monolito**. Não comece por microsserviços.

## Estilos (quando usar)

| Estilo | Use quando | Skill |
|--------|------------|--------|
| **Camadas simples** | CRUD, pouco domínio, um deploy | (default honesto; não force DDD) |
| **MVVM** | UI rica, estado de tela, mobile/desktop | `mvvm-architecture` |
| **Clean / Hexagonal** | I/O e frameworks devem ser plugáveis; testes de use case sem DB | `clean-architecture` |
| **DDD** | Regras complexas, linguagem de negócio, vários contextos | `ddd` |
| **Monolito modular** | Um deploy, vários limites de domínio | `modular-monolith` |
| **Vertical slice** | Features ponta a ponta sem camadas horizontais globais | `modular-monolith` |
| **CQRS** | Reads e writes divergem de verdade | `cqrs` |
| **Event-driven** | Desacoplar tempo e donos de reação | `event-driven-architecture` |
| **Microsserviços** | Autonomia de time/deploy/escala **com** domínio estável | `microservices-architecture` |

Combine: DDD define **o quê** isolar; Clean/hexagonal **como** as setas apontam; módulo/serviço **onde** isso roda.

## Consolidação (regras)

- **Coesão** por motivo de mudança (contexto), não por tipo técnico (`controllers/`, `services/`, `repositories/` globais como único eixo).
- **Acoplamento** visível: um módulo importa a API pública de outro — nunca o schema interno.
- Dependências apontam para o domínio, não o contrário (DB não dita entidade de negócio).
- Ciclos entre módulos são dívida. Quebre com eventos, ACL ou um terceiro módulo.
- Extraia microsserviço **depois** do limite existir no processo (mesmo DB, mesma PR) — `modular-monolith`.

```text
ruim:  ui → service → db  (tudo conhece tudo)
bom:   ui → application → domain ← adapters (db, http)
```

## O que não é arquitetura

- Pasta `CleanArchitecture.Domain` vazia com DTOs anêmicos
- MediatR/use case por botão sem invariante
- “Vamos de micro porque escala” sem SLO
- Event bus para RPC disfarçado

## Anti-padrões

- Big ball of mud com “vamos refatorar depois”
- Aplicar DDD + CQRS + ES + micro no mesmo CRUD
- Camadas obrigatórias em feature de 80 linhas
- Shared kernel que vira dump de tudo
- Arquitetura copiada de outro produto sem o mesmo domínio

## Fluxo ao decidir

1. `project-discovery` — o que o repo **já** é.
2. Nomeie contextos e donos de dado (`ddd` se o domínio pedir).
3. Escolha deploy: um processo (`modular-monolith`) vs vários (`microservices-architecture`).
4. Ajuste setas de dependência (`clean-architecture`) só onde o I/O atrapalha teste/evolução.
5. CQRS/eventos só com dor concreta de leitura ou desacoplamento.

## Integração com outras skills

- DDD: `ddd`
- Clean/hexagonal: `clean-architecture`
- Módulos num deploy: `modular-monolith`
- CQRS: `cqrs`
- Eventos: `event-driven-architecture`
- Serviços: `microservices-architecture`
- UI: `mvvm-architecture`
- HTTP: `api-design`

## Critérios de conclusão

- Estilo escolhido escrito em 5 linhas (por quê, o que fica de fora)
- Limites e direção de dependência observáveis no código
- Sem estilo extra sem dor correspondente
- Alinhado ao que o repositório já faz, salvo pedido de mudança
