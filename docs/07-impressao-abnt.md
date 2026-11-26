# Impressão do relatório (aviso provisório)

O botão **“Exportar relatório em PDF”** do relatório por projeto
(`/painel/evolucao`) abre a caixa de impressão do navegador. O PDF é gerado
pelo motor de impressão — **não há geração de arquivo no servidor**.

Neste momento, a folha impressa contém **apenas um aviso** de que a formatação
institucional será implementada mais tarde. A tela continua mostrando
normalmente o seletor de projeto, o histórico, a evolução qualitativa e os
documentos. O template definitivo, com a identidade da instituição e o timbre
da FATEC, será aplicado quando o arquivo oficial for fornecido.

## 1. O que sai na folha

- título **Aviso**;
- texto curto explicando que o template institucional será implementado mais
  tarde;
- nada mais da aplicação: barras de navegação, breadcrumb, rodapé, botões,
  seletor, cabeçalho institucional da tela e cards são ocultos.

O conteúdo do aviso está em
`src/components/staff/ProjectReportSheet.jsx`. Ele é marcado com
`data-print-only` e fica `display: none` na tela.

A folha já está preparada com as regras ABNT NBR 14724 em
`src/styles/print.css` (importado por `src/main.jsx`): A4, margens de 3 cm
superior/esquerda e 2 cm inferior/direita, Times New Roman 12 pt, entrelinha
1,5, parágrafos justificados com recuo de 1,25 cm e numeração de página no
canto superior direito via `@page { @top-right { content: counter(page) } }`
(conforme suporte do navegador a margin boxes).

## 2. Por que o cabeçalho institucional não aparece ainda

`<ReportLetterhead/>` continua no topo da tela, mas sua raiz tem
`data-print-hide`. Assim o aviso impresso não mistura um cabeçalho provisório
com o template definitivo que virá depois.

Quando o template oficial chegar:

1. implemente o novo conteúdo em `ProjectReportSheet.jsx`;
2. remova `data-print-hide` da raiz de `ReportLetterhead.jsx` se o cabeçalho
   fizer parte da folha definitiva;
3. ajuste as regras em `ProjectReportSheet.module.css` e, se necessário,
   `ReportLetterhead.module.css`.

## 3. Adicionar o timbre da FATEC no futuro

A instrução continua válida para quando o arte oficial existir:

1. coloque a imagem em **`public/img/`**, por exemplo
   `public/img/fatec-timbre.png` (PNG com fundo transparente, cerca de
   1200 × 300 px, ou um `.svg`);
2. em **`src/components/staff/reportShared.js`**, troque:

   ```js
   export const REPORT_LETTERHEAD_SRC = '/img/fatec-timbre.png';
   ```

3. ajuste `REPORT_UNIT_NAME` (sigla da unidade) e `REPORT_COURSE_NAME` no mesmo
   arquivo, se necessário.

Com `REPORT_LETTERHEAD_SRC` configurado, `<ReportLetterhead/>` passa a mostrar a
imagem em vez das linhas de texto na tela. A altura reservada na folha é de
26 mm; ajuste `.image` em `ReportLetterhead.module.css` se a arte tiver outra
proporção.

## 4. Como exportar

1. Entre como professor e abra `/painel/evolucao`.
2. Escolha o projeto no seletor.
3. Clique em **“Exportar relatório em PDF”**.
4. No diálogo do navegador:
   - destino: **Salvar como PDF**;
   - papel: **A4**;
   - escala: **100%**;
   - margens: **Padrão** (para que o `@page` seja respeitado);
   - desmarque **Cabeçalhos e rodapés** se o navegador duplicar a numeração.

> Se o navegador não renderizar `@top-right`, ative “Cabeçalhos e rodapés” no
> diálogo de impressão para obter a página numerada, ou gere o PDF em um
> mecanismo com suporte completo a CSS Paged Media (ex.: WeasyPrint/Paged.js).
> Essa limitação é do motor de impressão, não do conteúdo da folha.
