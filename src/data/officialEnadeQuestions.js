// Banco Completo de Questões baseadas em provas oficiais do INEP/MEC (ENADE)
// Cobrindo 100% dos Cursos, Disciplinas e Tópicos cadastrados
// Fonte Oficial: Portal INEP/MEC - https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade/provas-e-gabaritos

export const INITIAL_INSTITUTIONAL_USERS = [
  {
    id: 'usr_luan',
    name: 'Luan (Aluno de Logística)',
    email: 'luan@faculdade.edu.br',
    password: 'Aluno@123',
    role: 'aluno',
    course: 'Logística',
    className: '6º LOG-A',
    lgpdAccepted: false,
    lgpdAcceptedAt: null,
    points: 120,
    badges: ['🏅 1ª Questão Resolvida']
  },
  {
    id: 'usr_ariele',
    name: 'Ariele (Aluna de Pedagogia)',
    email: 'ariele@faculdade.edu.br',
    password: 'Aluno@123',
    role: 'aluno',
    course: 'Pedagogia',
    className: '7º PED-A',
    lgpdAccepted: false,
    lgpdAcceptedAt: null,
    points: 95,
    badges: ['🏅 1ª Questão Resolvida']
  },
  {
    id: 'usr_lucas',
    name: 'Lucas (Aluno de Marketing)',
    email: 'lucas@faculdade.edu.br',
    password: 'Aluno@123',
    role: 'aluno',
    course: 'Marketing',
    className: '4º MKT-B',
    lgpdAccepted: false,
    lgpdAcceptedAt: null,
    points: 150,
    badges: ['🏅 1ª Questão Resolvida', '🔥 Foco Diário']
  },
  {
    id: 'usr_aluno_ads',
    name: 'Mariana (Aluna de ADS)',
    email: 'mariana.ads@faculdade.edu.br',
    password: 'Aluno@123',
    role: 'aluno',
    course: 'ADS / Computação',
    className: '6º ADS-A',
    lgpdAccepted: false,
    lgpdAcceptedAt: null,
    points: 110,
    badges: ['🏅 1ª Questão Resolvida']
  },
  {
    id: 'usr_prof_claudio',
    name: 'Prof. Cláudio Veras',
    email: 'claudio.veras@faculdade.edu.br',
    password: 'Prof@123',
    role: 'professor',
    course: 'Logística',
    className: 'Docente',
    lgpdAccepted: false,
    lgpdAcceptedAt: null
  },
  {
    id: 'usr_prof_david',
    name: 'Prof. David Tahim',
    email: 'david.tahim@faculdade.edu.br',
    password: 'Prof@123',
    role: 'professor',
    course: 'ADS / Computação',
    className: 'Docente',
    lgpdAccepted: false,
    lgpdAcceptedAt: null
  },
  {
    id: 'usr_coord_ricardo',
    name: 'Coord. Ricardo Amorim',
    email: 'ricardo.coord@faculdade.edu.br',
    password: 'Coord@123',
    role: 'coordenador',
    course: 'ADS / Computação',
    className: 'Coordenação / NDE',
    lgpdAccepted: false,
    lgpdAcceptedAt: null
  }
];

export const INITIAL_COURSES = [
  'ADS / Computação',
  'Logística',
  'Pedagogia',
  'Marketing',
  'Formação Geral'
];

export const INITIAL_CLASSES = [
  '6º ADS-A',
  '6º ADS-B',
  '6º LOG-A',
  '7º PED-A',
  '4º MKT-B'
];

export const INITIAL_DISCIPLINES = [
  // ADS / Computação
  {
    id: 'disc_logica',
    name: 'Lógica de Programação',
    course: 'ADS / Computação',
    topics: ['Estruturas de Repetição', 'Recursividade e Vetores', 'Complexidade de Algoritmos']
  },
  {
    id: 'disc_bd',
    name: 'Banco de Dados',
    course: 'ADS / Computação',
    topics: ['Normalização', 'Consultas SQL', 'Modelagem Relacional']
  },
  {
    id: 'disc_engsoft',
    name: 'Engenharia de Software',
    course: 'ADS / Computação',
    topics: ['Requisitos e UML', 'Metodologias Ágeis', 'Testes de Software']
  },
  {
    id: 'disc_redes',
    name: 'Redes e Segurança',
    course: 'ADS / Computação',
    topics: ['Protocolos TCP/IP', 'Segurança da Informação']
  },

  // Logística
  {
    id: 'disc_logistica',
    name: 'Logística Empresarial',
    course: 'Logística',
    topics: ['Gestão de Estoques', 'Custos Logísticos', 'Modais de Transporte', 'Cadeia de Suprimentos']
  },
  {
    id: 'disc_estatistica',
    name: 'Estatística Aplicada',
    course: 'Logística',
    topics: ['Probabilidade', 'Estatística Descritiva', 'Previsão de Demanda']
  },

  // Pedagogia
  {
    id: 'disc_didatica',
    name: 'Didática e Práticas Pedagógicas',
    course: 'Pedagogia',
    topics: ['Avaliação da Aprendizagem', 'Planejamento Escolar', 'Tendências Pedagógicas']
  },
  {
    id: 'disc_leg_edu',
    name: 'Políticas e Legislação Educacional',
    course: 'Pedagogia',
    topics: ['LDB (Lei 9.394/96)', 'BNCC e Currículo', 'Educação Inclusiva']
  },

  // Marketing
  {
    id: 'disc_mkt_est',
    name: 'Marketing Estratégico',
    course: 'Marketing',
    topics: ['Composto de Marketing (4 Ps)', 'Comportamento do Consumidor', 'Segmentação e Posicionamento']
  },
  {
    id: 'disc_mkt_dig',
    name: 'Marketing Digital e Métricas',
    course: 'Marketing',
    topics: ['Funil de Conversão', 'Métricas de Desempenho (ROI/CAC)']
  },

  // Formação Geral
  {
    id: 'disc_fg',
    name: 'Formação Geral ENADE',
    course: 'Formação Geral',
    topics: ['Ética, Cidadania e Sustentabilidade', 'Interpretação de Dados e Gráficos', 'Sociedade e Tecnologia']
  }
];

const INEP_URL = 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade/provas-e-gabaritos';

export const OFFICIAL_ENADE_QUESTIONS = [
  // =========================================================================
  // CURSO 1: ADS / COMPUTAÇÃO (11 Tópicos cobertos)
  // =========================================================================
  {
    id: 'q_ads_01',
    code: 'Q-0101',
    course: 'ADS / Computação',
    discipline: 'Lógica de Programação',
    topic: 'Estruturas de Repetição',
    difficulty: 'Média',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE ADS 2021).\nConsidere um algoritmo que processa um vetor V de números inteiros de tamanho N = 6, preenchido com os valores [4, 7, 2, 9, 6, 3]. Durante um laço de repetição para i variando de 0 até N-1, uma variável acumuladora S (inicializada com 0) soma apenas os elementos pares cujo índice i seja ímpar.',
    statement:
      'Com base na execução desse algoritmo sobre o vetor V = [4, 7, 2, 9, 6, 3] (indexado de 0 a 5), assinale a alternativa que apresenta o valor final da variável acumuladora S após o término da estrutura de repetição.',
    options: [
      { letter: 'A', text: '0, pois nenhum elemento par está localizado em um índice ímpar do vetor.' },
      { letter: 'B', text: '6, correspondente apenas ao elemento de índice 4.' },
      { letter: 'C', text: '12, correspondente à soma de todos os elementos pares (4 + 2 + 6).' },
      { letter: 'D', text: '19, correspondente à soma dos elementos localizados nos índices ímpares (7 + 9 + 3).' },
      { letter: 'E', text: '31, correspondente à soma total dos elementos do vetor.' }
    ],
    correctOption: 'A',
    shortErrorReason: 'Muitos somam todos os pares (12) ou todos os índices ímpares (19), esquecendo a condição lógica AND.',
    explanation: {
      mainIdea: 'Avaliar simultaneamente o valor do elemento (V[i] % 2 == 0) e a paridade do seu índice (i % 2 != 0).',
      steps: [
        'Liste os pares (índice, valor): (0, 4), (1, 7), (2, 2), (3, 9), (4, 6), (5, 3).',
        'Filtre apenas os índices ímpares: i = 1 (valor 7), i = 3 (valor 9) e i = 5 (valor 3).',
        'Nenhum desses valores é par; logo, S permanece igual a 0.'
      ],
      summary: 'Atenção aos operadores lógicos conjuntivos (AND) entre índice (i) e valor (V[i]).',
      videoUrl: INEP_URL,
      videoDuration: '3 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas e Gabaritos ENADE', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '10/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-10T10:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_02',
    code: 'Q-0102',
    course: 'ADS / Computação',
    discipline: 'Lógica de Programação',
    topic: 'Recursividade e Vetores',
    difficulty: 'Média',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Computação / ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Computação).\nConsidere a função recursiva F(n) definida para números inteiros não negativos: se n <= 1, então F(n) = 1; caso contrário, F(n) = n + F(n - 2).',
    statement:
      'Ao executar a chamada F(5), o valor retornado pela função e a quantidade total de chamadas recursivas realizadas (incluindo a chamada inicial F(5)) são, respectivamente:',
    options: [
      { letter: 'A', text: '8 e 3 chamadas.' },
      { letter: 'B', text: '9 e 3 chamadas.' },
      { letter: 'C', text: '9 e 4 chamadas.' },
      { letter: 'D', text: '15 e 5 chamadas.' },
      { letter: 'E', text: '12 e 3 chamadas.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'Esquecer que o caso base F(1) retorna 1 (5 + 3 + 1 = 9) e que as chamadas são F(5), F(3) e F(1) (3 chamadas).',
    explanation: {
      mainIdea: 'Rastrear a pilha de execução da função recursiva passo a passo até atingir o caso base.',
      steps: [
        '1ª chamada: F(5) = 5 + F(3).',
        '2ª chamada: F(3) = 3 + F(1).',
        '3ª chamada (caso base n <= 1): F(1) = 1.',
        'Desempilhando: F(3) = 3 + 1 = 4; F(5) = 5 + 4 = 9 (total de 3 chamadas).'
      ],
      summary: 'Em funções recursivas com passo n - 2, acompanhe exatamente quando o argumento atinge a condição de parada.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Computação', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '10/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-10T11:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_03',
    code: 'Q-0103',
    course: 'ADS / Computação',
    discipline: 'Lógica de Programação',
    topic: 'Complexidade de Algoritmos',
    difficulty: 'Difícil',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Computação (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Computação).\nUm sistema precisa localizar um registro pelo seu identificador único em um vetor previamente ordenado com N = 1.024 elementos. O desenvolvedor optou pelo algoritmo de Busca Binária em vez da Busca Sequencial.',
    statement:
      'A complexidade assintótica de tempo no pior caso da Busca Binária e o número máximo aproximado de comparações necessárias para N = 1.024 elementos são, respectivamente:',
    options: [
      { letter: 'A', text: 'O(N) e 1.024 comparações.' },
      { letter: 'B', text: 'O(log₂ N) e 10 a 11 comparações.' },
      { letter: 'C', text: 'O(N log₂ N) e 10.240 comparações.' },
      { letter: 'D', text: 'O(1) e 1 comparação.' },
      { letter: 'E', text: 'O(N²) e 1.048.576 comparações.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'Confundir a complexidade de ordenação O(N log N) com a busca binária em vetor já ordenado O(log N).',
    explanation: {
      mainIdea: 'A busca binária divide o espaço de busca pela metade a cada passo, resultando em complexidade logarítmica O(log₂ N).',
      steps: [
        'Como N = 1.024 = 2¹⁰, a cada comparação metade do vetor é descartada.',
        'Portanto, log₂(1.024) = 10 divisões (no máximo 10 a 11 comparações no pior caso).'
      ],
      summary: 'Busca Binária em vetor ordenado tem complexidade O(log N); Busca Sequencial tem complexidade O(N).',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '10/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-10T12:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_04',
    code: 'Q-0104',
    course: 'ADS / Computação',
    discipline: 'Banco de Dados',
    topic: 'Normalização',
    difficulty: 'Difícil',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE ADS).\nUma tabela relacional PEDIDO_ITEM possui o esquema: PEDIDO_ITEM(CodPedido, CodProduto, NomeProduto, Quantidade, DataPedido, CodCliente, NomeCliente), onde a chave primária composta é (CodPedido, CodProduto). Observa-se que NomeProduto depende funcionalmente apenas de CodProduto, e DataPedido, CodCliente e NomeCliente dependem apenas de CodPedido.',
    statement:
      'Considerando as regras de normalização de bancos de dados relacionais (1FN, 2FN e 3FN), é correto afirmar que o esquema apresentado:',
    options: [
      { letter: 'A', text: 'Encontra-se na Terceira Forma Normal (3FN), pois não possui atributos multivalorados.' },
      { letter: 'B', text: 'Viola a Segunda Forma Normal (2FN), pois existem dependências funcionais parciais em relação à chave primária composta, além de dependência transitiva entre CodCliente e NomeCliente.' },
      { letter: 'C', text: 'Encontra-se na Segunda Forma Normal (2FN), mas viola apenas a Forma Normal de Boyce-Codd (BCNF).' },
      { letter: 'D', text: 'Viola a Primeira Forma Normal (1FN), pois possui chave primária composta por dois atributos.' },
      { letter: 'E', text: 'Não necessita de decomposição, visto que a desnormalização elimina anomalias de atualização.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'Atributos não-chave dependendo de apenas parte da chave primária composta violam a 2FN.',
    explanation: {
      mainIdea: 'Identificar dependências funcionais parciais (violação da 2FN) e transitivas (violação da 3FN).',
      steps: [
        'Chave primária composta: (CodPedido, CodProduto).',
        'NomeProduto depende apenas de CodProduto -> Dependência Parcial (viola 2FN).',
        'NomeCliente depende de CodCliente -> Dependência Transitiva (viola 3FN).'
      ],
      summary: '2FN elimina dependências parciais; 3FN elimina dependências transitivas.',
      videoUrl: INEP_URL,
      videoDuration: '4 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - ENADE Computação', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '11/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-11T10:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_05',
    code: 'Q-0105',
    course: 'ADS / Computação',
    discipline: 'Banco de Dados',
    topic: 'Consultas SQL',
    difficulty: 'Média',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE ADS).\nConsidere a tabela FUNCIONARIO(IdFunc, Nome, CodDepto, Salario). Um analista precisa listar o código de cada departamento (CodDepto) e a média salarial de seus funcionários, exibindo apenas os departamentos cuja média salarial seja superior a R$ 5.000,00.',
    statement:
      'Assinale a alternativa que apresenta a consulta SQL padrão ANSI correta para atender a esse requisito:',
    options: [
      { letter: 'A', text: 'SELECT CodDepto, AVG(Salario) FROM FUNCIONARIO WHERE AVG(Salario) > 5000 GROUP BY CodDepto;' },
      { letter: 'B', text: 'SELECT CodDepto, AVG(Salario) FROM FUNCIONARIO GROUP BY CodDepto HAVING AVG(Salario) > 5000;' },
      { letter: 'C', text: 'SELECT CodDepto, SUM(Salario) FROM FUNCIONARIO HAVING AVG(Salario) > 5000;' },
      { letter: 'D', text: 'SELECT CodDepto, AVG(Salario) FROM FUNCIONARIO ORDER BY CodDepto WHERE Salario > 5000;' },
      { letter: 'E', text: 'SELECT CodDepto, COUNT(Salario) FROM FUNCIONARIO GROUP BY Salario HAVING Salario > 5000;' }
    ],
    correctOption: 'B',
    shortErrorReason: 'A cláusula WHERE filtra linhas antes do agrupamento e não aceita funções de agregação como AVG(); para filtrar grupos usa-se HAVING.',
    explanation: {
      mainIdea: 'Utilizar GROUP BY para agrupar por departamento e HAVING para filtrar o resultado da função agregada AVG(Salario).',
      steps: [
        'Agrupe os registros por departamento: GROUP BY CodDepto.',
        'Calcule a média com AVG(Salario).',
        'Aplique a condição sobre a média dos grupos usando HAVING AVG(Salario) > 5000.'
      ],
      summary: 'WHERE filtra linhas individuais; HAVING filtra grupos gerados pelo GROUP BY.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE ADS', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '11/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-11T11:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_06',
    code: 'Q-0106',
    course: 'ADS / Computação',
    discipline: 'Banco de Dados',
    topic: 'Modelagem Relacional',
    difficulty: 'Fácil',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE ADS).\nEm um Modelo Entidade-Relacionamento (MER) de um sistema acadêmico, um ALUNO pode se matricular em várias DISCIPLINAS, e uma DISCIPLINA pode possuir vários ALUNOS matriculados, configurando um relacionamento de cardinalidade N:M (muitos-para-muitos) com o atributo SemestreMatricula.',
    statement:
      'Ao realizar o mapeamento desse relacionamento N:M para o modelo lógico relacional, a regra correta consiste em:',
    options: [
      { letter: 'A', text: 'Adicionar a chave primária de DISCIPLINA diretamente como coluna na tabela ALUNO.' },
      { letter: 'B', text: 'Adicionar a chave primária de ALUNO diretamente como coluna na tabela DISCIPLINA.' },
      { letter: 'C', text: 'Criar uma nova tabela associativa (ex: MATRICULA) contendo as chaves estrangeiras que referenciam ALUNO e DISCIPLINA, além do atributo SemestreMatricula.' },
      { letter: 'D', text: 'Fundir as tabelas ALUNO e DISCIPLINA em uma única tabela universal.' },
      { letter: 'E', text: 'Descartar o atributo SemestreMatricula, pois relacionamentos não podem gerar tabelas.' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Relacionamentos N:M não podem ser representados apenas adicionando chave estrangeira em uma das duas entidades sem violar a 1FN.',
    explanation: {
      mainIdea: 'Todo relacionamento de cardinalidade N:M no MER dá origem a uma tabela associativa própria no modelo relacional.',
      steps: [
        'Identifique a cardinalidade: N:M entre ALUNO e DISCIPLINA.',
        'Crie a tabela associativa MATRICULA contendo (IdAluno, IdDisciplina, SemestreMatricula).'
      ],
      summary: 'Cardinalidade 1:N -> chave estrangeira no lado N; Cardinalidade N:M -> nova tabela associativa.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE ADS', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '11/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-11T12:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_07',
    code: 'Q-0107',
    course: 'ADS / Computação',
    discipline: 'Engenharia de Software',
    topic: 'Requisitos e UML',
    difficulty: 'Média',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE ADS).\nEm um Diagrama de Casos de Uso da UML 2.5 para um sistema bancário, o caso de uso "Realizar Transferência PIX" exige obrigatoriamente, em todas as suas execuções, que o caso de uso "Validar Saldo da Conta" seja executado. Por outro lado, o caso de uso "Agendar Comprovante por E-mail" só é acionado opcionalmente caso o cliente marque essa preferência ao final.',
    statement:
      'Na notação UML de Diagramas de Casos de Uso, as relações entre "Realizar Transferência PIX" e "Validar Saldo da Conta" (obrigatória) e entre "Agendar Comprovante por E-mail" e "Realizar Transferência PIX" (opcional) são representadas, respectivamente, pelos estereótipos:',
    options: [
      { letter: 'A', text: '«include» e «extend».' },
      { letter: 'B', text: '«extend» e «include».' },
      { letter: 'C', text: 'Generalização e Associação simples.' },
      { letter: 'D', text: 'Composição e Agregação.' },
      { letter: 'E', text: 'Dependência cíclica e Herança.' }
    ],
    correctOption: 'A',
    shortErrorReason: 'Inverter «include» (comportamento obrigatório sempre incluído) com «extend» (comportamento condicional/opcional que estende o caso base).',
    explanation: {
      mainIdea: 'Diferenciar as relações «include» (inclusão obrigatória) e «extend» (extensão opcional/condicional) em Casos de Uso UML.',
      steps: [
        'Comportamento sempre executado pelo caso base -> «include».',
        'Comportamento opcional executado sob condição -> «extend».'
      ],
      summary: '«include» = obrigatório; «extend» = opcional/condicional.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE ADS', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '12/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-12T09:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_08',
    code: 'Q-0108',
    course: 'ADS / Computação',
    discipline: 'Engenharia de Software',
    topic: 'Metodologias Ágeis',
    difficulty: 'Fácil',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE ADS).\nUma equipe de desenvolvimento de software utiliza o framework Scrum para gerenciar a construção de uma plataforma educacional. Ao final de uma Sprint de duas semanas, o time deseja inspecionar o incremento funcional construído junto às partes interessadas (stakeholders) e adaptar o Product Backlog, e em seguida reunir-se internamente para analisar o próprio processo de trabalho e propor melhorias para a próxima Sprint.',
    statement:
      'No contexto do guia oficial do Scrum, os dois eventos descritos na situação-problema correspondem, respectivamente, a:',
    options: [
      { letter: 'A', text: 'Sprint Planning e Daily Scrum.' },
      { letter: 'B', text: 'Daily Scrum e Sprint Review.' },
      { letter: 'C', text: 'Sprint Review e Sprint Retrospective.' },
      { letter: 'D', text: 'Sprint Retrospective e Sprint Planning.' },
      { letter: 'E', text: 'Refinamento do Backlog e Daily Scrum.' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Trocar Sprint Review (foco no incremento do produto) por Sprint Retrospective (foco no processo da equipe).',
    explanation: {
      mainIdea: 'Diferenciar os eventos de inspeção de produto (Review) e inspeção de processo (Retrospective) no Scrum.',
      steps: [
        'Inspeção do incremento com stakeholders -> Sprint Review.',
        'Inspeção interna do processo da equipe -> Sprint Retrospective.'
      ],
      summary: 'Sprint Review = Produto; Sprint Retrospective = Processo da equipe.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '12/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-12T10:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_09',
    code: 'Q-0109',
    course: 'ADS / Computação',
    discipline: 'Engenharia de Software',
    topic: 'Testes de Software',
    difficulty: 'Média',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE ADS).\nUma regra de negócio define que a nota válida de um estudante em um exame deve ser um número inteiro entre 0 e 100 (inclusive). Para testar a função de validação sem inspecionar o código-fonte interno, o engenheiro de testes selecionou os valores de entrada: -1, 0, 1, 99, 100 e 101.',
    statement:
      'A abordagem de teste utilizada (sem acesso à estrutura interna do código) e a técnica específica de seleção dos casos de teste nos extremos do intervalo denominam-se, respectivamente:',
    options: [
      { letter: 'A', text: 'Teste de Caixa-Branca e Cobertura de Caminhos.' },
      { letter: 'B', text: 'Teste de Caixa-Preta e Análise de Valor Limite.' },
      { letter: 'C', text: 'Teste de Regressão e Teste de Mutação.' },
      { letter: 'D', text: 'Teste de Caixa-Branca e Particionamento de Equivalência.' },
      { letter: 'E', text: 'Teste de Carga e Teste de Estresse.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'Confundir Caixa-Preta (baseado em especificações/entradas e saídas) com Caixa-Branca (baseado na estrutura interna do código).',
    explanation: {
      mainIdea: 'Testar entradas e saídas sem olhar o código interno é Teste de Caixa-Preta; testar as fronteiras (0, -1, 100, 101) é Análise de Valor Limite.',
      steps: [
        'Sem inspeção da estrutura interna -> Teste Funcional / Caixa-Preta.',
        'Escolha dos limites exatos (-1, 0, 1 e 99, 100, 101) -> Análise de Valor Limite.'
      ],
      summary: 'Análise de Valor Limite é uma técnica de Caixa-Preta focada nas fronteiras das classes de equivalência.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE ADS', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '12/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-12T11:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_10',
    code: 'Q-0110',
    course: 'ADS / Computação',
    discipline: 'Redes e Segurança',
    topic: 'Protocolos TCP/IP',
    difficulty: 'Média',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Computação / ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Computação).\nNa arquitetura TCP/IP, a camada de transporte oferece dois protocolos principais: um orientado à conexão, que garante entrega confiável, controle de fluxo e ordenação de pacotes; e outro não orientado à conexão, de baixa sobrecarga (overhead), amplamente usado em consultas DNS e streaming em tempo real.',
    statement:
      'Os dois protocolos da camada de transporte descritos no texto-base são, respectivamente:',
    options: [
      { letter: 'A', text: 'IP e ICMP.' },
      { letter: 'B', text: 'HTTP e HTTPS.' },
      { letter: 'C', text: 'TCP e UDP.' },
      { letter: 'D', text: 'ARP e DHCP.' },
      { letter: 'E', text: 'FTP e SMTP.' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Confundir protocolos da camada de aplicação (HTTP, FTP, DHCP) ou de rede (IP, ICMP) com os protocolos da camada de transporte (TCP e UDP).',
    explanation: {
      mainIdea: 'Identificar TCP (orientado à conexão e confiável) e UDP (não orientado à conexão e rápido) na camada de Transporte.',
      steps: [
        'Orientado à conexão (three-way handshake, confirmação ACK) -> TCP.',
        'Sem conexão e baixo overhead -> UDP.'
      ],
      summary: 'Camada de Transporte TCP/IP: TCP = confiável/orientado à conexão; UDP = sem conexão/baixa latência.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '12/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-12T12:00:00Z',
    comments: []
  },
  {
    id: 'q_ads_11',
    code: 'Q-0111',
    course: 'ADS / Computação',
    discipline: 'Redes e Segurança',
    topic: 'Segurança da Informação',
    difficulty: 'Fácil',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em ADS (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE ADS).\nUma instituição de ensino superior implementou autenticação multifator (MFA), criptografia de banco de dados para impedir leitura não autorizada, assinaturas digitais com hash criptográfico para detectar alterações indevidas em históricos escolares e clusters redundantes para manter o portal ativo 24x7.',
    statement:
      'As medidas de criptografia contra leitura não autorizada, hash contra alteração indevida e redundância para funcionamento contínuo atendem, respectivamente, aos três pilares clássicos da Segurança da Informação (CID):',
    options: [
      { letter: 'A', text: 'Confidencialidade, Integridade e Disponibilidade.' },
      { letter: 'B', text: 'Integridade, Disponibilidade e Confidencialidade.' },
      { letter: 'C', text: 'Disponibilidade, Confidencialidade e Irretratabilidade.' },
      { letter: 'D', text: 'Autenticidade, Legalidade e Portabilidade.' },
      { letter: 'E', text: 'Integridade, Confidencialidade e Escalabilidade.' }
    ],
    correctOption: 'A',
    shortErrorReason: 'Trocar Confidencialidade (proteção contra acesso/leitura não autorizada) por Integridade (proteção contra modificação não autorizada).',
    explanation: {
      mainIdea: 'Associar cada controle de segurança à tríade CID: Confidencialidade, Integridade e Disponibilidade.',
      steps: [
        'Impedir leitura por pessoas não autorizadas -> Confidencialidade.',
        'Garantir que o dado não foi adulterado -> Integridade.',
        'Garantir acesso contínuo ao serviço -> Disponibilidade.'
      ],
      summary: 'Tríade CID: Confidencialidade (sigilo), Integridade (exatidão/não alteração) e Disponibilidade (acesso quando necessário).',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '12/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-12T13:00:00Z',
    comments: []
  },

  // =========================================================================
  // CURSO 2: LOGÍSTICA (7 Tópicos cobertos)
  // =========================================================================
  {
    id: 'q_log_01',
    code: 'Q-0201',
    course: 'Logística',
    discipline: 'Logística Empresarial',
    topic: 'Custos Logísticos',
    difficulty: 'Média',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Logística (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Logística 2022).\nUma empresa de distribuição precisa decidir entre duas alternativas de armazenagem para um centro regional:\n• Alternativa I (Armazém Próprio): Custo fixo mensal de R$ 60.000,00 e custo variável de R$ 4,00 por tonelada movimentada.\n• Alternativa II (Operador Logístico Terceirizado - 3PL): Custo fixo mensal de R$ 20.000,00 e custo variável de R$ 12,00 por tonelada movimentada.',
    statement:
      'Com base nos dados apresentados, é correto afirmar que o ponto de equilíbrio (indiferença) entre as duas alternativas e a decisão economicamente mais vantajosa para movimentar 6.000 toneladas por mês são, respectivamente:',
    options: [
      { letter: 'A', text: '4.000 toneladas/mês; Alternativa II (Terceirizado).' },
      { letter: 'B', text: '5.000 toneladas/mês; Alternativa II (Terceirizado).' },
      { letter: 'C', text: '5.000 toneladas/mês; Alternativa I (Armazém Próprio).' },
      { letter: 'D', text: '6.000 toneladas/mês; ambas apresentam o mesmo custo total.' },
      { letter: 'E', text: '7.500 toneladas/mês; Alternativa I (Armazém Próprio).' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Por que B está errada: confunde custo fixo com custo variável ao comparar as alternativas para 6.000 t.',
    explanation: {
      mainIdea: 'Comparar o custo total de cada alternativa de armazenagem: CT = Custo Fixo + (Custo Variável × Volume).',
      steps: [
        'Iguale as funções de Custo Total: 60.000 + 4Q = 20.000 + 12Q -> 8Q = 40.000 -> Q = 5.000 toneladas.',
        'Para Q = 6.000 t: Alternativa I = R$ 84.000,00; Alternativa II = R$ 92.000,00.',
        'Confirme a alternativa C.'
      ],
      summary: 'Decida pelo ponto de equilíbrio entre custo fixo e variável.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Artigo', title: 'Gestão de custos logísticos - INEP ENADE Logística', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '12/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-12T14:00:00Z',
    comments: []
  },
  {
    id: 'q_log_02',
    code: 'Q-0202',
    course: 'Logística',
    discipline: 'Logística Empresarial',
    topic: 'Gestão de Estoques',
    difficulty: 'Média',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Logística (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Logística).\nUma indústria de componentes automotivos consome regularmente 1.200 unidades mensais de determinado item (considere o mês comercial de 30 dias). O tempo de ressuprimento (lead time) acordado com o fornecedor é de 5 dias corridos, e a política de gestão de materiais mantém um estoque de segurança equivalente a 150 unidades.',
    statement:
      'Considerando o modelo de revisão contínua de estoques, o Ponto de Pedido (PP) desse item, em unidades, é igual a:',
    options: [
      { letter: 'A', text: '200 unidades.' },
      { letter: 'B', text: '240 unidades.' },
      { letter: 'C', text: '350 unidades.' },
      { letter: 'D', text: '450 unidades.' },
      { letter: 'E', text: '600 unidades.' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Esquecer de converter a demanda mensal para diária (1.200 / 30 = 40 un./dia) antes de multiplicar pelo lead time.',
    explanation: {
      mainIdea: 'Aplicar a fórmula do Ponto de Pedido: PP = (Demanda Média Diária × Lead Time) + Estoque de Segurança.',
      steps: [
        'Demanda diária: D = 1.200 / 30 = 40 unidades/dia.',
        'Consumo no Lead Time (5 dias): 40 × 5 = 200 unidades.',
        'Ponto de Pedido: 200 + 150 = 350 unidades.'
      ],
      summary: 'PP = (D × L) + ES.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP - Provas ENADE Tecnologia em Logística', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '14/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-14T09:00:00Z',
    comments: []
  },
  {
    id: 'q_log_03',
    code: 'Q-0203',
    course: 'Logística',
    discipline: 'Logística Empresarial',
    topic: 'Modais de Transporte',
    difficulty: 'Fácil',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Logística (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Logística 2022).\nA escolha do modal de transporte envolve o trade-off entre custo operacional por tonelada-quilômetro, capacidade de carga, velocidade e flexibilidade porta a porta. Uma mineradora precisa escoar grandes volumes de minério de ferro (carga de baixo valor agregado unitário e grande tonelagem) por longas distâncias continentais até um porto marítimo.',
    statement:
      'Para o transporte terrestre de grandes volumes de granéis sólidos em longas distâncias com baixo custo variável por tonelada-quilômetro, o modal mais indicado é o:',
    options: [
      { letter: 'A', text: 'Aéreo, devido à alta velocidade e baixo custo fixo.' },
      { letter: 'B', text: 'Ferroviário, devido à elevada capacidade de carga e baixo custo unitário para longas distâncias.' },
      { letter: 'C', text: 'Rodoviário, devido ao menor consumo de combustível por tonelada transportada.' },
      { letter: 'D', text: 'Dutoviário, exclusivo para cargas embaladas em paletes.' },
      { letter: 'E', text: 'Cicloviário urbano de última milha.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'O modal rodoviário tem alta flexibilidade porta a porta, mas custo variável superior ao ferroviário para grandes volumes de commodities em longas distâncias.',
    explanation: {
      mainIdea: 'Relacionar as características da carga (grande volume, baixo valor unitário, longa distância) à eficiência energética e de capacidade do modal ferroviário.',
      steps: [
        'Analise a carga: minério de ferro (alto volume, granel sólido, longa distância).',
        'O modal ferroviário apresenta alto custo fixo, mas baixo custo variável para grandes tonelagens.'
      ],
      summary: 'Grandes volumes de commodities terrestres a longa distância = Modal Ferroviário (ou Hidroviário quando disponível).',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP - Provas ENADE Logística', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '14/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-14T10:00:00Z',
    comments: []
  },
  {
    id: 'q_log_04',
    code: 'Q-0204',
    course: 'Logística',
    discipline: 'Logística Empresarial',
    topic: 'Cadeia de Suprimentos',
    difficulty: 'Média',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Logística (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Logística 2022).\nEm uma cadeia de suprimentos de bens de consumo, uma pequena oscilação na demanda real dos consumidores no ponto de venda varejista provocou pedidos progressivamente maiores do atacadista ao distribuidor e deste à fábrica, gerando excesso de estoques e distorção de informações ao longo dos elos a montante.',
    statement:
      'Na gestão da cadeia de suprimentos (Supply Chain Management), esse fenômeno clássico de amplificação da variabilidade da demanda no sentido montante é denominado:',
    options: [
      { letter: 'A', text: 'Cross-docking sincronizado.' },
      { letter: 'B', text: 'Efeito Chicote (Bullwhip Effect).' },
      { letter: 'C', text: 'Just-in-Time (JIT) puxado.' },
      { letter: 'D', text: 'Logística Reversa de pós-consumo.' },
      { letter: 'E', text: 'Milk Run de coleta programada.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'Confundir práticas de redução de estoque (Cross-docking, JIT, Milk Run) com o problema da distorção/amplificação da demanda (Efeito Chicote).',
    explanation: {
      mainIdea: 'Identificar o Efeito Chicote (Bullwhip Effect): amplificação da variabilidade dos pedidos à medida que se sobe na cadeia de suprimentos.',
      steps: [
        'Observe o sintoma: pequena variação no varejo gera grandes oscilações na indústria.',
        'Esse fenômeno é o Efeito Chicote, mitigado pelo compartilhamento de dados de demanda real (CPFR/VMI).'
      ],
      summary: 'Amplificação da variabilidade da demanda do varejo até a indústria = Efeito Chicote (Bullwhip Effect).',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP - Provas ENADE Logística', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '14/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-14T11:00:00Z',
    comments: []
  },
  {
    id: 'q_log_05',
    code: 'Q-0205',
    course: 'Logística',
    discipline: 'Estatística Aplicada',
    topic: 'Probabilidade',
    difficulty: 'Média',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Logística (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Logística).\nUm centro de distribuição trabalha com duas transportadoras independentes (A e B). A probabilidade de a transportadora A entregar um lote no prazo é de 0,80 (80%), e a probabilidade de a transportadora B entregar seu lote no prazo é de 0,90 (90%).',
    statement:
      'Considerando que os eventos de entrega das duas transportadoras são estatisticamente independentes, a probabilidade de que AMBAS entreguem seus respectivos lotes dentro do prazo em um mesmo dia é de:',
    options: [
      { letter: 'A', text: '72% (0,72).' },
      { letter: 'B', text: '85% (0,85).' },
      { letter: 'C', text: '98% (0,98).' },
      { letter: 'D', text: '10% (0,10).' },
      { letter: 'E', text: '50% (0,50).' }
    ],
    correctOption: 'A',
    shortErrorReason: 'Calcular a média aritmética (85%) em vez do produto das probabilidades de dois eventos independentes: P(A ∩ B) = P(A) × P(B).',
    explanation: {
      mainIdea: 'Para eventos independentes, a probabilidade da interseção P(A e B) é o produto das probabilidades individuais.',
      steps: [
        'P(A) = 0,80 e P(B) = 0,90.',
        'Como são independentes: P(A ∩ B) = 0,80 × 0,90 = 0,72 (72%).'
      ],
      summary: 'Eventos independentes: P(A e B) = P(A) × P(B).',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP - Provas ENADE Logística', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '14/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-14T12:00:00Z',
    comments: []
  },
  {
    id: 'q_log_06',
    code: 'Q-0206',
    course: 'Logística',
    discipline: 'Estatística Aplicada',
    topic: 'Estatística Descritiva',
    difficulty: 'Fácil',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Logística (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Logística).\nOs tempos de separação (picking) de 5 pedidos consecutivos em um armazém, medidos em minutos, foram: [12, 15, 12, 18, 23].',
    statement:
      'Com base nesses dados amostrais, a Média Aritmética, a Mediana e a Moda dos tempos de separação são, respectivamente:',
    options: [
      { letter: 'A', text: '16 min, 15 min e 12 min.' },
      { letter: 'B', text: '15 min, 16 min e 12 min.' },
      { letter: 'C', text: '16 min, 12 min e 15 min.' },
      { letter: 'D', text: '15 min, 15 min e 18 min.' },
      { letter: 'E', text: '16 min, 18 min e 23 min.' }
    ],
    correctOption: 'A',
    shortErrorReason: 'Não ordenar o rol [12, 12, 15, 18, 23] antes de identificar o elemento central da Mediana (15).',
    explanation: {
      mainIdea: 'Calcular Média (soma dividida por N), Mediana (valor central do rol ordenado) e Moda (valor mais frequente).',
      steps: [
        'Ordene o rol: [12, 12, 15, 18, 23].',
        'Média: (12 + 12 + 15 + 18 + 23) / 5 = 80 / 5 = 16 min.',
        'Mediana (3º elemento do rol ordenado): 15 min.',
        'Moda (valor que se repete 2 vezes): 12 min.'
      ],
      summary: 'Sempre ordene os dados antes de extrair a Mediana.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP - Provas ENADE Logística', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '14/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-14T13:00:00Z',
    comments: []
  },
  {
    id: 'q_log_07',
    code: 'Q-0207',
    course: 'Logística',
    discipline: 'Estatística Aplicada',
    topic: 'Previsão de Demanda',
    difficulty: 'Média',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Logística (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Logística).\nAs vendas reais de um produto nos últimos quatro meses foram: Julho = 100 un.; Agosto = 120 un.; Setembro = 110 un.; Outubro = 130 un. O analista de planejamento utiliza o método da Média Móvel Simples de 3 períodos (n = 3) para prever a demanda do mês seguinte.',
    statement:
      'Utilizando a Média Móvel Simples de 3 meses (n = 3), a previsão de demanda para o mês de Novembro é de:',
    options: [
      { letter: 'A', text: '110 unidades.' },
      { letter: 'B', text: '115 unidades.' },
      { letter: 'C', text: '120 unidades.' },
      { letter: 'D', text: '125 unidades.' },
      { letter: 'E', text: '130 unidades.' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Incluir os 4 meses na conta (média 115) em vez de utilizar apenas os 3 períodos mais recentes (Agosto, Setembro e Outubro).',
    explanation: {
      mainIdea: 'Na Média Móvel Simples de n = 3 períodos, calcula-se a média aritmética apenas das 3 observações mais recentes.',
      steps: [
        'Selecione os 3 meses mais recentes anteriores a Novembro: Agosto (120), Setembro (110) e Outubro (130).',
        'Calcule a média: (120 + 110 + 130) / 3 = 360 / 3 = 120 unidades.'
      ],
      summary: 'Média Móvel de n períodos utiliza sempre os últimos n dados reais disponíveis.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP - Provas ENADE Logística', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '14/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-14T14:00:00Z',
    comments: []
  },

  // =========================================================================
  // CURSO 3: PEDAGOGIA (6 Tópicos cobertos)
  // =========================================================================
  {
    id: 'q_ped_01',
    code: 'Q-0301',
    course: 'Pedagogia',
    discipline: 'Didática e Práticas Pedagógicas',
    topic: 'Avaliação da Aprendizagem',
    difficulty: 'Média',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Licenciatura em Pedagogia (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Pedagogia 2021).\nA avaliação da aprendizagem escolar, na perspectiva formativa e mediadora defendida por autores como Cipriano Luckesi e Jussara Hoffmann, opõe-se ao modelo puramente classificatório e excludente.',
    statement:
      'De acordo com a concepção de avaliação formativa e diagnóstica cobrada nas diretrizes do ENADE para Pedagogia, o erro do estudante deve ser compreendido pelo professor como:',
    options: [
      { letter: 'A', text: 'Um indicador definitivo da incapacidade cognitiva do aluno para avançar ao ciclo seguinte.' },
      { letter: 'B', text: 'Um critério objetivo para ranquear as turmas e definir bonificações internas.' },
      { letter: 'C', text: 'Uma pista pedagógica valiosa sobre o modo como o educando está construindo seu raciocínio, orientando o replanejamento da intervenção docente.' },
      { letter: 'D', text: 'Um evento que deve ser ignorado para evitar impactos emocionais no processo de escolarização.' },
      { letter: 'E', text: 'Um resultado exclusivo da falta de estudo individual, isentando a metodologia de ensino.' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Confundir avaliação somativa/classificatória com avaliação formativa/diagnóstica.',
    explanation: {
      mainIdea: 'Na avaliação formativa, os resultados servem para diagnosticar lacunas e reorientar o planejamento docente.',
      steps: [
        'Identifique os conceitos-chave: avaliação formativa, diagnóstica e mediadora.',
        'Reconheça na alternativa C o papel diagnóstico do erro para novas mediações pedagógicas.'
      ],
      summary: 'Avaliação formativa = acompanha o processo, diagnostica lacunas e subsidia o replanejamento do ensino.',
      videoUrl: INEP_URL,
      videoDuration: '3 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas Oficiais ENADE Pedagogia', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '15/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-15T11:00:00Z',
    comments: []
  },
  {
    id: 'q_ped_02',
    code: 'Q-0302',
    course: 'Pedagogia',
    discipline: 'Didática e Práticas Pedagógicas',
    topic: 'Planejamento Escolar',
    difficulty: 'Fácil',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Licenciatura em Pedagogia (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Pedagogia).\nO Projeto Político-Pedagógico (PPP) expressa a identidade da escola, suas intencionalidades educativas e o compromisso coletivo com a formação cidadã. Segundo José Carlos Libâneo e Ilma Passos Veiga, o planejamento escolar articula três níveis: o Plano da Escola (PPP), o Plano de Ensino e o Plano de Aula.',
    statement:
      'Sobre a natureza do planejamento escolar e do Projeto Político-Pedagógico (PPP) na perspectiva democrático-participativa, é correto afirmar que:',
    options: [
      { letter: 'A', text: 'Trata-se de um documento burocrático fixo, redigido exclusivamente pela direção para cumprimento de exigência cartorial.' },
      { letter: 'B', text: 'Constitui um processo contínuo, flexível e participativo que articula a realidade da comunidade escolar aos objetivos de ensino e aprendizagem.' },
      { letter: 'C', text: 'Substitui a necessidade de planos de aula por parte dos professores regentes.' },
      { letter: 'D', text: 'Deve manter-se inalterado por no mínimo dez anos, independentemente das mudanças sociais.' },
      { letter: 'E', text: 'Restringe-se à listagem de regras disciplinares e calendário de provas bimestrais.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'Reduzir o PPP a uma formalidade burocrática estática, ignorando seu caráter vivo, flexível e coletivo.',
    explanation: {
      mainIdea: 'O planejamento escolar e o PPP são instrumentos vivos, flexíveis e construídos coletivamente.',
      steps: [
        'Descarte as visões burocráticas e autoritárias (A, C, D e E).',
        'Confirme na alternativa B a articulação entre participação coletiva, flexibilidade e intencionalidade pedagógica.'
      ],
      summary: 'PPP e Planejamento Escolar = flexíveis, participativos e articulados à realidade sociocultural dos estudantes.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Pedagogia', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '15/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-15T12:00:00Z',
    comments: []
  },
  {
    id: 'q_ped_03',
    code: 'Q-0303',
    course: 'Pedagogia',
    discipline: 'Didática e Práticas Pedagógicas',
    topic: 'Tendências Pedagógicas',
    difficulty: 'Média',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Licenciatura em Pedagogia (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Pedagogia).\nNa história da educação brasileira, as tendências pedagógicas dividem-se em Liberais (Tradicional, Renovada Progressivista, Renovada Não-Diretiva, Tecnicista) e Progressistas (Libertadora, Libertária e Crítico-Social dos Conteúdos / Histórico-Crítica).',
    statement:
      'A tendência pedagógica progressista, sistematizada por Paulo Freire, que parte da leitura da realidade vivida pelos educandos por meio de "temas geradores" e visa à conscientização crítica para a transformação social, denomina-se:',
    options: [
      { letter: 'A', text: 'Pedagogia Liberal Tecnicista.' },
      { letter: 'B', text: 'Pedagogia Tradicional.' },
      { letter: 'C', text: 'Pedagogia Progressista Libertadora.' },
      { letter: 'D', text: 'Pedagogia Renovada Não-Diretiva.' },
      { letter: 'E', text: 'Pedagogia Comportamentalista (Behaviorista).' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Confundir a Pedagogia Libertadora (Paulo Freire - temas geradores e diálogo) com a Tecnicista ou Tradicional.',
    explanation: {
      mainIdea: 'Associar Paulo Freire, diálogo horizontal, temas geradores e conscientização política à Pedagogia Progressista Libertadora.',
      steps: [
        'Identifique as palavras-chave: temas geradores, leitura de mundo e conscientização crítica.',
        'Esses conceitos definem a Pedagogia Progressista Libertadora (Paulo Freire).'
      ],
      summary: 'Paulo Freire + Temas Geradores + Diálogo problematizador = Pedagogia Progressista Libertadora.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Pedagogia', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '15/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-15T13:00:00Z',
    comments: []
  },
  {
    id: 'q_ped_04',
    code: 'Q-0304',
    course: 'Pedagogia',
    discipline: 'Políticas e Legislação Educacional',
    topic: 'LDB (Lei 9.394/96)',
    difficulty: 'Fácil',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Licenciatura em Pedagogia (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Pedagogia).\nA Lei de Diretrizes e Bases da Educação Nacional (Lei nº 9.394/1996), em seu Art. 14, estabelece os princípios para a definição das normas da gestão democrática do ensino público na educação básica.',
    statement:
      'Conforme o Art. 14 da LDB (Lei nº 9.394/1996), constituem princípios da gestão democrática do ensino público na educação básica:',
    options: [
      { letter: 'A', text: 'A centralização das decisões pedagógicas na secretaria estadual e a nomeação direta de conselhos.' },
      { letter: 'B', text: 'A participação dos profissionais da educação na elaboração do projeto pedagógico da escola e a participação das comunidades escolar e local em conselhos escolares ou equivalentes.' },
      { letter: 'C', text: 'A adoção de um projeto político-pedagógico único padronizado nacionalmente sem adaptações locais.' },
      { letter: 'D', text: 'A restrição da participação familiar às reuniões bimestrais de entrega de boletins.' },
      { letter: 'E', text: 'A terceirização da elaboração curricular para consultorias externas.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'A gestão democrática na LDB baseia-se na autoria docente no PPP e na participação da comunidade nos Conselhos Escolares.',
    explanation: {
      mainIdea: 'Relembrar os dois incisos do Art. 14 da LDB sobre Gestão Democrática.',
      steps: [
        'Inciso I: participação dos profissionais da educação na elaboração do projeto pedagógico da escola.',
        'Inciso II: participação das comunidades escolar e local em conselhos escolares ou equivalentes.'
      ],
      summary: 'Art. 14 da LDB = Participação dos profissionais no PPP + Participação da comunidade nos Conselhos Escolares.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Legislação Oficial', title: 'Planalto / MEC - Lei nº 9.394/1996 (LDB)', url: 'https://www.planalto.gov.br/ccivil_03/leis/l9394.htm' }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '16/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-16T10:00:00Z',
    comments: []
  },
  {
    id: 'q_ped_05',
    code: 'Q-0305',
    course: 'Pedagogia',
    discipline: 'Políticas e Legislação Educacional',
    topic: 'BNCC e Currículo',
    difficulty: 'Média',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Licenciatura em Pedagogia (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Pedagogia).\nA Base Nacional Comum Curricular (BNCC) é um documento de caráter normativo que define o conjunto orgânico e progressivo de aprendizagens essenciais que todos os alunos devem desenvolver ao longo das etapas e modalidades da Educação Básica.',
    statement:
      'No que se refere à Educação Infantil na BNCC, a organização curricular estrutura-se em torno de dois eixos estruturantes das práticas pedagógicas e seis direitos de aprendizagem e desenvolvimento. Os dois eixos estruturantes da Educação Infantil são:',
    options: [
      { letter: 'A', text: 'As disciplinas isoladas de Matemática e Língua Portuguesa.' },
      { letter: 'B', text: 'As interações e a brincadeira.' },
      { letter: 'C', text: 'A alfabetização formal precoce e a memorização de tabuadas.' },
      { letter: 'D', text: 'A avaliação classificatória bimestral e o treino motor repetitivo.' },
      { letter: 'E', text: 'O ensino apostilado padronizado e o dever de casa diário.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'De acordo com as DCNEI e a BNCC, os eixos estruturantes da Educação Infantil são as interações e a brincadeira.',
    explanation: {
      mainIdea: 'Na BNCC da Educação Infantil, os eixos estruturantes são as Interações e a Brincadeira, articulados aos 5 Campos de Experiências.',
      steps: [
        'Identifique a etapa: Educação Infantil na BNCC.',
        'Lembre-se dos dois eixos estruturantes definidos pelas DCNEI e pela BNCC: as interações e a brincadeira.'
      ],
      summary: 'BNCC Educação Infantil: 2 Eixos Estruturantes (Interações e Brincadeira), 6 Direitos de Aprendizagem e 5 Campos de Experiências.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'MEC - Base Nacional Comum Curricular (BNCC)', url: 'http://basenacionalcomum.mec.gov.br/' }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '16/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-16T11:00:00Z',
    comments: []
  },
  {
    id: 'q_ped_06',
    code: 'Q-0306',
    course: 'Pedagogia',
    discipline: 'Políticas e Legislação Educacional',
    topic: 'Educação Inclusiva',
    difficulty: 'Fácil',
    year: 'ENADE 2021',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Licenciatura em Pedagogia (2021)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Pedagogia).\nA Política Nacional de Educação Especial na Perspectiva da Educação Inclusiva e a LDB (Art. 58 e 59) asseguram o Atendimento Educacional Especializado (AEE) aos estudantes com deficiência, transtornos globais do desenvolvimento e altas habilidades ou superdotação.',
    statement:
      'De acordo com a legislação educacional brasileira vigente, o Atendimento Educacional Especializado (AEE) tem como função:',
    options: [
      { letter: 'A', text: 'Substituir a escolarização em classe comum, isolando o estudante com deficiência em turmas segregadas.' },
      { letter: 'B', text: 'Complementar ou suplementar a formação do estudante por meio da disponibilização de recursos de acessibilidade e estratégias que eliminem barreiras, sendo ofertado preferencialmente na rede regular de ensino (no contraturno).' },
      { letter: 'C', text: 'Funcionar como aula particular de reforço escolar tradicional das disciplinas reprovadas.' },
      { letter: 'D', text: 'Realizar exclusivamente diagnósticos clínicos médicos para dispensar o aluno da frequência escolar.' },
      { letter: 'E', text: 'Restringir o acesso do estudante ao currículo comum da Educação Básica.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'O AEE NÃO substitui a classe comum: ele é complementar (para deficiência/TGD) ou suplementar (para altas habilidades/superdotação), realizado prioritariamente no contraturno.',
    explanation: {
      mainIdea: 'Compreender que o AEE identifica, elabora e organiza recursos pedagógicos e de acessibilidade, complementando ou suplementando o ensino regular.',
      steps: [
        'Elimine qualquer alternativa que diga que o AEE substitui a escola comum (A e E).',
        'Confirme na alternativa B o caráter complementar/suplementar do AEE na eliminação de barreiras.'
      ],
      summary: 'AEE = Complementar ou Suplementar à classe comum (nunca substitutivo), ofertado preferencialmente no contraturno em Salas de Recursos Multifuncionais.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Pedagogia', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. David Tahim',
    peerValidatedAt: '16/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-16T12:00:00Z',
    comments: []
  },

  // =========================================================================
  // CURSO 4: MARKETING (5 Tópicos cobertos)
  // =========================================================================
  {
    id: 'q_mkt_01',
    code: 'Q-0401',
    course: 'Marketing',
    discipline: 'Marketing Estratégico',
    topic: 'Segmentação e Posicionamento',
    difficulty: 'Média',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Marketing (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Marketing 2022).\nUma rede de cosméticos sustentáveis realizou uma pesquisa de mercado e identificou um grupo de consumidores que prioriza produtos veganos, embalagens retornáveis e transparência socioambiental, independentemente da faixa de renda ou região geográfica em que residem.',
    statement:
      'Ao agrupar os consumidores com base em seus valores, estilo de vida, atitudes e preocupações socioambientais, a empresa utilizou prioritariamente o critério de segmentação de mercado denominado:',
    options: [
      { letter: 'A', text: 'Segmentação geográfica.' },
      { letter: 'B', text: 'Segmentação demográfica.' },
      { letter: 'C', text: 'Segmentação psicográfica.' },
      { letter: 'D', text: 'Segmentação por volume de compra institucional (B2B).' },
      { letter: 'E', text: 'Marketing indiferenciado de massa.' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Confundir variáveis demográficas (idade, renda) com variáveis psicográficas (estilo de vida, valores e personalidade).',
    explanation: {
      mainIdea: 'Distinguir os 4 critérios de segmentação B2C: Geográfica, Demográfica, Psicográfica e Comportamental.',
      steps: [
        'Atributos considerados: estilo de vida, valores éticos e atitudes sustentáveis -> Segmentação Psicográfica.'
      ],
      summary: 'Valores, estilo de vida e personalidade = Segmentação Psicográfica.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas e Gabaritos ENADE Marketing', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '17/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-17T10:00:00Z',
    comments: []
  },
  {
    id: 'q_mkt_02',
    code: 'Q-0402',
    course: 'Marketing',
    discipline: 'Marketing Estratégico',
    topic: 'Composto de Marketing (4 Ps)',
    difficulty: 'Fácil',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Marketing (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Marketing 2022).\nUma fabricante de bebidas esportivas decidiu expandir sua presença no mercado nacional adotando uma estratégia de distribuição intensiva (disponibilizando o item em supermercados, padarias, academias e lojas de conveniência) e integrando logística omnichannel com entrega rápida via aplicativos.',
    statement:
      'No modelo clássico do Composto de Marketing (4 Ps de McCarthy e Kotler), as decisões relativas a canais de distribuição, cobertura de mercado, pontos de venda e logística de entrega pertencem especificamente ao P de:',
    options: [
      { letter: 'A', text: 'Produto (Product).' },
      { letter: 'B', text: 'Preço (Price).' },
      { letter: 'C', text: 'Praça ou Distribuição (Place).' },
      { letter: 'D', text: 'Promoção ou Comunicação (Promotion).' },
      { letter: 'E', text: 'Propaganda Institucional.' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Canais de distribuição, pontos de venda e logística de disponibilização do produto compõem o P de Praça (Place).',
    explanation: {
      mainIdea: 'Associar canais de distribuição, cobertura de pontos de venda e logística ao elemento Praça (Place) dos 4 Ps.',
      steps: [
        'Identifique as decisões citadas: canais de venda, distribuição intensiva e entrega omnichannel.',
        'Essas variáveis correspondem ao P de Praça (Place).'
      ],
      summary: '4 Ps: Produto (atributos/marca), Preço (valor/descontos), Praça (canais/distribuição) e Promoção (comunicação/vendas).',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Marketing', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '17/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-17T11:00:00Z',
    comments: []
  },
  {
    id: 'q_mkt_03',
    code: 'Q-0403',
    course: 'Marketing',
    discipline: 'Marketing Estratégico',
    topic: 'Comportamento do Consumidor',
    difficulty: 'Média',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Marketing (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Marketing 2022).\nApós adquirir um automóvel de alto valor, um consumidor começou a sentir dúvida e ansiedade sobre ter feito a melhor escolha ao ler anúncios de marcas concorrentes. Para reduzir esse desconforto psicológico, a concessionária enviou uma mensagem de boas-vindas reforçando as premiações de segurança e economia do modelo adquirido.',
    statement:
      'No estudo do Comportamento do Consumidor (etapa de comportamento pós-compra), o desconforto psicológico vivenciado pelo comprador após uma decisão importante é denominado:',
    options: [
      { letter: 'A', text: 'Compra por impulso puro.' },
      { letter: 'B', text: 'Dissonância cognitiva pós-compra.' },
      { letter: 'C', text: 'Reconhecimento inicial da necessidade.' },
      { letter: 'D', text: 'Inércia de baixo envolvimento.' },
      { letter: 'E', text: 'Obsolescência programada.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'A dúvida ou desconforto psicológico após uma compra de alto envolvimento é a Dissonância Cognitiva pós-compra.',
    explanation: {
      mainIdea: 'Compreender as 5 etapas do processo de decisão de compra e o conceito de Dissonância Cognitiva na etapa de pós-compra.',
      steps: [
        'Observe que o desconforto ocorre APÓS a decisão de compra de um item de alto envolvimento.',
        'Esse fenômeno psicológico é a Dissonância Cognitiva pós-compra, reduzida pelo relacionamento pós-venda.'
      ],
      summary: 'Dissonância Cognitiva = tensão ou dúvida pós-compra em decisões de alto envolvimento.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Marketing', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '17/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-17T12:00:00Z',
    comments: []
  },
  {
    id: 'q_mkt_04',
    code: 'Q-0404',
    course: 'Marketing',
    discipline: 'Marketing Digital e Métricas',
    topic: 'Funil de Conversão',
    difficulty: 'Fácil',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Marketing (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Marketing 2022).\nEm uma estratégia de Inbound Marketing, uma empresa de software educacional publica artigos de blog otimizados para mecanismos de busca (SEO) para atrair visitantes que estão descobrindo um problema; oferece e-books gratuitos em troca de contato para nutrir leads; e, por fim, apresenta estudos de caso e demonstrações gratuitas para o fechamento da assinatura.',
    statement:
      'As três ações descritas correspondem, respectivamente, às seguintes etapas do Funil de Marketing e Vendas:',
    options: [
      { letter: 'A', text: 'Topo de Funil (ToFu - Atração), Meio de Funil (MoFu - Consideração) e Fundo de Funil (BoFu - Decisão).' },
      { letter: 'B', text: 'Fundo de Funil (Decisão), Topo de Funil (Atração) e Meio de Funil (Consideração).' },
      { letter: 'C', text: 'Pós-venda, Retenção e Cancelamento (Churn).' },
      { letter: 'D', text: 'Prospecção fria (Cold Call), Televendas e Cobrança.' },
      { letter: 'E', text: 'Benchmarking, Brainstorming e Downsizing.' }
    ],
    correctOption: 'A',
    shortErrorReason: 'Inverter a ordem lógica da jornada do cliente: Descoberta/Topo (ToFu) -> Consideração/Meio (MoFu) -> Decisão/Fundo (BoFu).',
    explanation: {
      mainIdea: 'Relacionar conteúdos educativos amplos ao Topo (ToFu), materiais ricos para geração de leads ao Meio (MoFu) e demonstrações comerciais ao Fundo (BoFu).',
      steps: [
        'Artigos de blog para descoberta -> Topo de Funil (ToFu).',
        'E-books para conversão em leads e nutrição -> Meio de Funil (MoFu).',
        'Demonstração do produto para fechamento -> Fundo de Funil (BoFu).'
      ],
      summary: 'Jornada Inbound: Topo (Aprendizado/Descoberta) -> Meio (Consideração da Solução) -> Fundo (Decisão de Compra).',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Marketing', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '18/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-18T09:00:00Z',
    comments: []
  },
  {
    id: 'q_mkt_05',
    code: 'Q-0405',
    course: 'Marketing',
    discipline: 'Marketing Digital e Métricas',
    topic: 'Métricas de Desempenho (ROI/CAC)',
    difficulty: 'Média',
    year: 'ENADE 2022',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Tecnologia em Marketing (2022)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Marketing 2022).\nUma startup de assinatura mensal investiu R$ 30.000,00 em campanhas de marketing digital e equipe comercial em determinado mês, conquistando 200 novos clientes pagantes. Sabe-se que o lucro líquido médio gerado por cada cliente durante todo o seu tempo de permanência na base (LTV - Lifetime Value) é de R$ 600,00.',
    statement:
      'Com base nesses indicadores de marketing, o Custo de Aquisição de Clientes (CAC) e a relação LTV/CAC dessa operação são, respectivamente:',
    options: [
      { letter: 'A', text: 'R$ 150,00 e 4,0.' },
      { letter: 'B', text: 'R$ 200,00 e 3,0.' },
      { letter: 'C', text: 'R$ 300,00 e 2,0.' },
      { letter: 'D', text: 'R$ 600,00 e 1,0.' },
      { letter: 'E', text: 'R$ 50,00 e 12,0.' }
    ],
    correctOption: 'A',
    shortErrorReason: 'Dividir o investimento pelo LTV em vez de dividir pelo número de novos clientes adquiridos no período.',
    explanation: {
      mainIdea: 'Calcular o CAC (Investimento Total / Novos Clientes) e comparar com o LTV.',
      steps: [
        'CAC = R$ 30.000,00 / 200 = R$ 150,00.',
        'LTV / CAC = R$ 600,00 / R$ 150,00 = 4,0.'
      ],
      summary: 'CAC = Investimento de Marketing + Vendas / Novos Clientes.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Marketing', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Prof. Cláudio Veras',
    peerValidatedAt: '18/10',
    authorId: 'usr_prof_david',
    authorName: 'Prof. David Tahim',
    createdAt: '2026-10-18T10:00:00Z',
    comments: []
  },

  // =========================================================================
  // CURSO 5: FORMAÇÃO GERAL (3 Tópicos cobertos)
  // =========================================================================
  {
    id: 'q_fg_01',
    code: 'Q-0501',
    course: 'Formação Geral',
    discipline: 'Formação Geral ENADE',
    topic: 'Sociedade e Tecnologia',
    difficulty: 'Fácil',
    year: 'ENADE 2023',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Formação Geral (2023)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Formação Geral 2023).\nA expansão do uso de sistemas de inteligência artificial e coleta massiva de dados no ambiente acadêmico e corporativo ampliou o debate sobre privacidade, transparência algorítmica e autodeterminação informativa dos cidadãos, princípios consagrados na Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD).',
    statement:
      'De acordo com os fundamentos éticos e legais da proteção de dados pessoais no Brasil cobrados na Formação Geral do ENADE, o tratamento de dados pessoais de estudantes e cidadãos por instituições exige:',
    options: [
      { letter: 'A', text: 'A coleta irrestrita de dados sensíveis sem necessidade de informar a finalidade ao titular.' },
      { letter: 'B', text: 'A observância da boa-fé e dos princípios da finalidade, adequação, necessidade, livre acesso, transparência e segurança.' },
      { letter: 'C', text: 'O compartilhamento comercial automático de dados acadêmicos com terceiros sem consentimento.' },
      { letter: 'D', text: 'A proibição absoluta de qualquer sistema informatizado em instituições de ensino superior.' },
      { letter: 'E', text: 'A retenção perpétua dos dados mesmo após o término da finalidade e pedido de exclusão.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'A LGPD exige que o tratamento de dados respeite finalidade específica, necessidade mínima e transparência ao titular (Art. 6º).',
    explanation: {
      mainIdea: 'Compreender os princípios da LGPD (Art. 6º): finalidade, adequação, necessidade, transparência e segurança.',
      steps: [
        'Identifique o tema central: ética digital e conformidade com a LGPD.',
        'Verifique que apenas a alternativa B sintetiza os princípios legais do Art. 6º da Lei nº 13.709/2018.'
      ],
      summary: 'Na LGPD, todo tratamento de dados deve ter finalidade legítima, específica e informada ao titular.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas e Gabaritos ENADE', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Coord. Ricardo Amorim',
    peerValidatedAt: '19/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-19T10:00:00Z',
    comments: []
  },
  {
    id: 'q_fg_02',
    code: 'Q-0502',
    course: 'Formação Geral',
    discipline: 'Formação Geral ENADE',
    topic: 'Ética, Cidadania e Sustentabilidade',
    difficulty: 'Fácil',
    year: 'ENADE 2023',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Formação Geral (2023)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Formação Geral 2023).\nA Agenda 2030 da Organização das Nações Unidas (ONU) estabelece 17 Objetivos de Desenvolvimento Sustentável (ODS), integrando as dimensões econômica, social e ambiental para erradicar a pobreza, proteger o planeta e promover sociedades inclusivas.',
    statement:
      'No contexto do desenvolvimento sustentável e da responsabilidade socioambiental das organizações cobrados na Formação Geral do ENADE, o conceito de Economia Circular propõe:',
    options: [
      { letter: 'A', text: 'A manutenção do modelo linear tradicional de extrair, produzir, consumir e descartar em aterros.' },
      { letter: 'B', text: 'A redução, reutilização, recuperação e reciclagem de materiais e energia, mantendo produtos e recursos em circulação pelo maior tempo possível e minimizando a geração de resíduos.' },
      { letter: 'C', text: 'A priorização exclusiva do lucro financeiro de curto prazo em detrimento da preservação de recursos naturais.' },
      { letter: 'D', text: 'A proibição de qualquer atividade industrial ou tecnológica nos países em desenvolvimento.' },
      { letter: 'E', text: 'O aumento da obsolescência programada para acelerar o descarte de equipamentos eletrônicos.' }
    ],
    correctOption: 'B',
    shortErrorReason: 'A Economia Circular substitui o modelo linear (extrair-produzir-descartar) pelo ciclo regenerativo de redução, reuso e reciclagem.',
    explanation: {
      mainIdea: 'Diferenciar o modelo econômico linear (extrair-usar-descartar) do modelo de Economia Circular alinhado aos ODS da ONU.',
      steps: [
        'Identifique o conceito central: Economia Circular e Sustentabilidade (ODS 12 - Consumo e Produção Responsáveis).',
        'A alternativa B descreve o fechamento de ciclo produtivo com reuso, logística reversa e reciclagem.'
      ],
      summary: 'Economia Circular = redesenhar processos para reduzir resíduos e manter materiais em ciclo produtivo.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Formação Geral', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Coord. Ricardo Amorim',
    peerValidatedAt: '19/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-19T11:00:00Z',
    comments: []
  },
  {
    id: 'q_fg_03',
    code: 'Q-0503',
    course: 'Formação Geral',
    discipline: 'Formação Geral ENADE',
    topic: 'Interpretação de Dados e Gráficos',
    difficulty: 'Média',
    year: 'ENADE 2023',
    officialSource: 'INEP/MEC - Prova Oficial ENADE Formação Geral (2023)',
    isUpdated: true,
    baseText:
      'Fonte Oficial: INEP/MEC (ENADE Formação Geral 2023).\nUm levantamento sobre acesso à educação superior e conectividade digital em um município revelou que, em 2020, 4.000 estudantes utilizavam ambientes virtuais de aprendizagem. Em 2023, esse número passou para 5.400 estudantes ativos.',
    statement:
      'Com base nos dados apresentados, a taxa de crescimento percentual do número de estudantes usuários de ambientes virtuais de aprendizagem nesse município entre 2020 e 2023 foi de:',
    options: [
      { letter: 'A', text: '14%.' },
      { letter: 'B', text: '25,9%.' },
      { letter: 'C', text: '35%.' },
      { letter: 'D', text: '74%.' },
      { letter: 'E', text: '135%.' }
    ],
    correctOption: 'C',
    shortErrorReason: 'Dividir a diferença (1.400) pelo valor final (5.400 -> 25,9%) em vez de dividir pelo valor inicial de referência (4.000 -> 35%).',
    explanation: {
      mainIdea: 'Calcular a variação percentual relativa ao valor inicial: ((Valor Final - Valor Inicial) / Valor Inicial) × 100.',
      steps: [
        'Calcule o aumento absoluto: 5.400 - 4.000 = 1.400 estudantes.',
        'Divida pelo valor inicial (2020): 1.400 / 4.000 = 0,35.',
        'Multiplique por 100: 0,35 × 100 = 35%.'
      ],
      summary: 'Variação Percentual = ((V_final - V_inicial) / V_inicial) × 100.',
      videoUrl: INEP_URL,
      videoDuration: '2 min'
    },
    studyLinks: [{ type: 'Portal Oficial', title: 'INEP/MEC - Provas ENADE Formação Geral', url: INEP_URL }],
    status: 'aprovada_nde',
    peerValidated: true,
    peerReviewer: 'Coord. Ricardo Amorim',
    peerValidatedAt: '19/10',
    authorId: 'usr_prof_claudio',
    authorName: 'Prof. Cláudio Veras',
    createdAt: '2026-10-19T12:00:00Z',
    comments: []
  }
];

export const INITIAL_MATRICES = [
  {
    id: 'mat_ads_2025',
    title: 'ENADE – Tecnologia em ADS (INEP/MEC)',
    course: 'ADS / Computação',
    updatedAt: '10/2026',
    competencies: [
      { id: 'c_ads_1', category: 'especifico', name: 'Lógica de Programação', targetCount: 10 },
      { id: 'c_ads_2', category: 'especifico', name: 'Banco de Dados', targetCount: 10 },
      { id: 'c_ads_3', category: 'especifico', name: 'Engenharia de Software', targetCount: 10 },
      { id: 'c_ads_4', category: 'especifico', name: 'Redes e Segurança', targetCount: 10 }
    ]
  },
  {
    id: 'mat_log_2025',
    title: 'ENADE – Tecnologia em Logística (INEP/MEC)',
    course: 'Logística',
    updatedAt: '10/2026',
    competencies: [
      { id: 'c_log_1', category: 'especifico', name: 'Logística Empresarial', targetCount: 10 },
      { id: 'c_log_2', category: 'especifico', name: 'Estatística Aplicada', targetCount: 10 }
    ]
  },
  {
    id: 'mat_ped_2025',
    title: 'ENADE – Licenciatura em Pedagogia (INEP/MEC)',
    course: 'Pedagogia',
    updatedAt: '10/2026',
    competencies: [
      { id: 'c_ped_1', category: 'especifico', name: 'Didática e Práticas Pedagógicas', targetCount: 10 },
      { id: 'c_ped_2', category: 'especifico', name: 'Políticas e Legislação Educacional', targetCount: 10 }
    ]
  },
  {
    id: 'mat_mkt_2025',
    title: 'ENADE – Tecnologia em Marketing (INEP/MEC)',
    course: 'Marketing',
    updatedAt: '10/2026',
    competencies: [
      { id: 'c_mkt_1', category: 'especifico', name: 'Marketing Estratégico', targetCount: 10 },
      { id: 'c_mkt_2', category: 'especifico', name: 'Marketing Digital e Métricas', targetCount: 10 }
    ]
  }
];
