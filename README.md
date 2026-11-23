# ENADE+ & ENADE Prep — Sistema de Avaliação e Preparação ENADE

Aplicação web desenvolvida em **React + Vite (Node.js)** seguindo integralmente os levantamentos de requisitos, personas, diagrama de casos de uso (`UC01` a `UC19`), backlog priorizado pelo método MoSCoW (`US01` a `US24`), requisitos funcionais (`RF01` a `RF12`), não funcionais (`RNF01` a `RNF07`) e os protótipos de tela do projeto.

---

## Como executar o projeto

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento Vite
npm run dev
```

Acesse no navegador em: `http://localhost:5173`

---

## Mapeamento de Requisitos Implementados

### 1. Segurança, Acesso e LGPD (`UC01`, `US11`, `RNF06`, `RNF07`)
- **Tela Inicial (`AuthView.jsx`)**: Autenticação integrada via SSO institucional com seleção de perfil (`Aluno`, `Professor`, `Coordenador`), simulação de erro de SSO com botão *Tentar novamente* e canal de suporte de TI.
- **Modal Obrigatório no 1º Acesso (LGPD)**: Termo de uso e proteção de dados com os 5 itens exigidos (1. Quais dados coletamos, 2. Para que usamos, 3. Por quanto tempo guardamos, 4. Seus direitos, 5. Contato do DPO), botão *Aceitar e entrar* habilitado somente após marcar *Li e aceito o termo*, e botão *Recusar* que encerra a sessão.

### 2. Visão do Professor (`ProfessorView.jsx` — `ENADE Prep`)
- **Tela P1 — Cadastro e Gestão de Questões (`US01`, `US05`, `US21`, `US24`, `RF09`, `RF10`, `RF12`)**:
  - **1. Classificação**: Disciplina, Assunto/Tópico, Dificuldade (Fácil, Média, Difícil), Ano/Origem e sinalização de **Conteúdo Atualizado**.
  - **2. Enunciado e alternativas**: Texto-base, barra de editor de texto rico, enunciado e 5 alternativas (A–E) com marcação da alternativa correta.
  - **3. Explicação pedagógica e materiais**: Abas *Texto em etapas* (Ideia principal, Passo a passo numerado e Resumo final), *Vídeo* e *Links de estudo* com validação de link.
  - **Pré-visualização em tempo real**: Alternância entre visão **Web** e **Mobile** (`US12`) + **Checklist de completude** e alerta de questões semelhantes no repositório.
- **Revisão por Pares (`US02`, `UC05`, `RF11`, `RF12`)**: Fila ágil de validação entre professores com atribuição do selo visual verde **"Questão Validada"**.
- **Repositório Compartilhado e Meus Downloads (`US18`, `UC03`)**: Busca por filtros combinados e download de questões/listas em arquivo.

### 3. Visão do Coordenador / NDE (`CoordinatorView.jsx` — `ENADE Prep`)
- **Tela C1 — Painel de Desempenho e Alertas (`US07`, `UC07`)**:
  - Filtros por Curso, Turma, Período e Disciplina.
  - **Alertas automáticos de gargalos** para tópicos com alto índice de erro, com ações *Ver detalhes*, *Sugerir aula de revisão* e *Dispensar*.
  - Indicadores gerais, gráfico de `% de acertos por disciplina`, evolução semanal por turma, tabela detalhada por turma e exportação de relatórios em CSV.
- **Tela C2 — Governança e Alinhamento às Matrizes do ENADE (`US20`, `UC06`)**:
  - Gestão de matrizes de referência e acompanhamento de cobertura do banco por competência versus meta.
  - **Parecer do NDE**: Avaliação de Competência, Conteúdo, Nível ENADE, Problema Real e Alinhamento à Matriz, com ações *Aprovar para o banco*, *Devolver ao autor* e *Reprovar*, além de registro de Atas e Critérios Institucionais.

### 4. Visão do Aluno (`StudentView.jsx` — `ENADE+`)
- **Dashboard do Aluno (`US06`, `UC15`, `RF05`)**: Acertos gerais, questões resolvidas, sequência de estudo (streaks), desafio de hoje, desempenho por disciplina, diagnóstico de pontos fracos e histórico recente.
- **Banco de Questões (`US19`, `US21`, `UC08`, `UC09`, `RF01`, `RF02`)**: Organização por disciplina e tópico, filtros combináveis, selos *Validada* e *Atualizada*, ano da prova e indicador de dificuldade.
- **Montar Simulado Personalizado e Cronometrado (`US03`, `US13`, `US14`, `UC10`, `UC11`)**: Seleção combinada de temas, botão **"Usar meus pontos fracos"** (preenche tópicos abaixo de 60% de acerto), filtros, modo Cronometrado ou Livre e correção a cada questão ou no final.
- **Resolução, Correção Imediata e Explicação em Camadas (`US04`, `US15`, `US23`, `US24`, `US10`, `UC12`, `UC13`, `UC14`, `UC19`)**:
  - Cronômetro regressivo, botão *Ampliar* texto-base, opção de riscar/eliminar alternativas, feedback imediato e navegação dinâmica.
  - Explicação em abas (*Passo a passo* com Ideia Principal, Etapas numeradas e Resumo para revisar salvável no caderno, *Vídeo* e *Discussão*), *Materiais complementares* e área de comentários com botão **Ocultar discussão** para quem prefere estudar sozinho.
- **Plano de Revisão e Evolução (`US16`, `US17`, `US22`, `UC16`)**: Diagnóstico de erros, sugestões da semana com treino direto, gráfico de acertos por semana e comparação entre categorias.
- **Desafios Diários, Flashcards e Gamificação Opcional (`US08`, `US09`, `UC17`, `UC18`, `RF06`, `RF07`)**: Pílulas diárias de 5 a 10 minutos, streaks, criação de flashcards e ranking opcional com pontos e conquistas.

