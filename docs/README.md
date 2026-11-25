# Documentação do PI²

Documentação completa do repositório, separada do `README.md` (que é o
resumo de entrada). Leia na ordem ou pule direto para o que precisa.

| # | Documento | Conteúdo |
| --- | --- | --- |
| 01 | [Visão geral](01-visao-geral.md) | O que é o PI², escopo do protótipo, personas e mapa de prints |
| 02 | [Arquitetura](02-arquitetura.md) | Rotas, layouts, guardas RBAC, code splitting, contextos e camadas |
| 03 | [Telas](03-telas.md) | As 25 telas, o que cada uma mostra e os prints de referência |
| 04 | [Design system](04-design-system.md) | Tokens, kit de componentes, animações e regras visuais |
| 05 | [Mocks](05-mocks.md) | Fonte de dados simulados, helpers e como editar sem tocar em JSX |
| 06 | [Refatoração](06-refatoracao.md) | Histórico das melhorias de código (itens 1–7) e achados corrigidos |

---

## Comandos

```bash
npm install      # instala as dependências (uma vez)
npm run dev      # servidor de desenvolvimento (http://localhost:5173)
npm run build    # build de produção em dist/
npm run preview  # serve o build de produção
```

## Onde olhar primeiro

- **Mudar conteúdo de tela** → [`05-mocks.md`](05-mocks.md) (`src/mocks/`)
- **Mudar cor, tipografia ou espaçamento** → [`04-design-system.md`](04-design-system.md) (`src/styles/variables.css`)
- **Adicionar rota/tela** → [`02-arquitetura.md`](02-arquitetura.md) (`src/App.jsx`)
- **Entender uma tela específica** → [`03-telas.md`](03-telas.md)
- **Convenções de código** → [`06-refatoracao.md`](06-refatoracao.md)
