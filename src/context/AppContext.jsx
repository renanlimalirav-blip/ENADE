import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_INSTITUTIONAL_USERS,
  INITIAL_COURSES,
  INITIAL_CLASSES,
  INITIAL_DISCIPLINES,
  OFFICIAL_ENADE_QUESTIONS,
  INITIAL_MATRICES
} from '../data/officialEnadeQuestions';

const STORAGE_KEY = 'enade_plus_v2_auth_official';

const getInitialSeededState = () => ({
  currentUser: null,
  users: INITIAL_INSTITUTIONAL_USERS,
  courses: INITIAL_COURSES,
  classes: INITIAL_CLASSES,
  disciplines: INITIAL_DISCIPLINES,
  questions: OFFICIAL_ENADE_QUESTIONS,
  deletedQuestionIds: [],
  attempts: [],
  simulados: [],
  savedTemplates: [],
  savedQuestionIds: [],
  savedNotes: [],
  flashcards: [],
  dailyStreak: 0,
  lastStudyDate: null,
  weeklyGoalDays: 3,
  optionalStreakGoal: 7,
  gamificationEnabled: true,
  hideDiscussionsDefault: false,
  downloads: [],
  matrices: INITIAL_MATRICES,
  ndeAtas: [],
  institutionalCriteria: [
    'Mesmo nível de complexidade do ENADE (INEP/MEC)',
    'Foco em resolução de problemas reais da área de formação',
    'Alinhamento à Matriz de Referência vigente do INEP/MEC por curso',
    'Presença de justificativa pedagógica estruturada em etapas',
    'Revisão por pares concluída antes do parecer final do NDE'
  ],
  alertConfig: {
    errorThresholdPct: 50,
    minResponses: 1,
    notifyEmail: true
  },
  customAlerts: [],
  dismissedAlertKeys: [],
  revisionSuggestions: [],
  exportedReports: []
});

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const deletedIds = parsed.deletedQuestionIds || [];
        const savedQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];
        const savedIds = new Set(savedQuestions.map((q) => q.id));

        // Mescla todas as questões oficiais do ENADE (cobrindo 100% dos cursos, disciplinas e tópicos)
        // com quaisquer questões novas cadastradas pelo professor
        const missingOfficialQuestions = OFFICIAL_ENADE_QUESTIONS.filter(
          (oq) => !savedIds.has(oq.id) && !deletedIds.includes(oq.id)
        );
        const mergedQuestions = [...savedQuestions, ...missingOfficialQuestions];

        // Mescla cursos e disciplinas iniciais com os personalizados
        const mergedCourses = Array.from(
          new Set([...INITIAL_COURSES, ...(parsed.courses || [])])
        );

        const savedDiscNames = new Set(
          (parsed.disciplines || []).map((d) => d.name.toLowerCase())
        );
        const mergedDisciplines = [
          ...(parsed.disciplines || []),
          ...INITIAL_DISCIPLINES.filter((d) => !savedDiscNames.has(d.name.toLowerCase()))
        ];

        return {
          ...getInitialSeededState(),
          ...parsed,
          deletedQuestionIds: deletedIds,
          courses: mergedCourses,
          disciplines: mergedDisciplines,
          questions: mergedQuestions.length > 0 ? mergedQuestions : OFFICIAL_ENADE_QUESTIONS,
          users:
            parsed.users && parsed.users.length > 0
              ? parsed.users
              : INITIAL_INSTITUTIONAL_USERS
        };
      }
    } catch (e) {
      console.error('Erro ao ler estado local:', e);
    }
    return getInitialSeededState();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Erro ao salvar estado local:', e);
    }
  }, [state]);

  // 1 & 2. Autenticação com Senha e Bloqueio Estrito entre Perfis (Aluno, Professor, Coordenador)
  const authenticateWithPassword = ({ email, password, selectedRole }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      return {
        ok: false,
        error: 'Informe seu login institucional (e-mail) e sua senha.'
      };
    }

    const existingUser = state.users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!existingUser) {
      return {
        ok: false,
        error: 'Login institucional não encontrado. Verifique o e-mail digitado ou cadastre uma nova conta institucional.'
      };
    }

    // Regra 2: Não permitir que o mesmo login acesse perfis diferentes (especialmente Professor e Coordenador)
    if (existingUser.role !== selectedRole) {
      const roleLabels = {
        aluno: 'ALUNO',
        professor: 'PROFESSOR',
        coordenador: 'COORDENADOR / NDE'
      };
      return {
        ok: false,
        error: `Acesso negado: O login "${existingUser.email}" pertence exclusivamente ao perfil de ${roleLabels[existingUser.role]} e não possui permissão para acessar o perfil de ${roleLabels[selectedRole]}.`
      };
    }

    // Regra 1: Validação obrigatória de senha para todos os perfis
    if (existingUser.password !== password) {
      return {
        ok: false,
        error: 'Senha inválida. Verifique suas credenciais institucionais e tente novamente.'
      };
    }

    setState((prev) => ({
      ...prev,
      currentUser: existingUser
    }));

    return { ok: true, user: existingUser };
  };

  // Cadastro de novo usuário institucional com senha e vínculo único de perfil
  const registerInstitutionalUser = ({ name, email, password, role, course, className }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    if (!cleanName || !cleanEmail || !password) {
      return {
        ok: false,
        error: 'Preencha nome, e-mail institucional e senha para cadastrar.'
      };
    }

    if (password.length < 4) {
      return {
        ok: false,
        error: 'A senha deve possuir pelo menos 4 caracteres.'
      };
    }

    // Verifica se o login já existe em QUALQUER perfil (impede que o mesmo login seja usado para Professor e Coordenador)
    const existingAnyRole = state.users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (existingAnyRole) {
      const roleLabels = {
        aluno: 'ALUNO',
        professor: 'PROFESSOR',
        coordenador: 'COORDENADOR / NDE'
      };
      return {
        ok: false,
        error: `Este login (${cleanEmail}) já está registrado exclusivamente no perfil de ${roleLabels[existingAnyRole.role]}. Por segurança e segregação de funções, o mesmo login não pode acessar múltiplos perfis.`
      };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password,
      role, // 'aluno' | 'professor' | 'coordenador'
      course: course?.trim() || 'ADS / Computação',
      className: className?.trim() || (role === 'aluno' ? '6º ADS-A' : 'Docente'),
      lgpdAccepted: false,
      lgpdAcceptedAt: null,
      points: 0,
      badges: [],
      createdAt: new Date().toISOString()
    };

    setState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      courses:
        newUser.course && !prev.courses.includes(newUser.course)
          ? [...prev.courses, newUser.course]
          : prev.courses,
      classes:
        newUser.className && !prev.classes.includes(newUser.className)
          ? [...prev.classes, newUser.className]
          : prev.classes,
      currentUser: newUser
    }));

    return { ok: true, user: newUser };
  };

  const acceptLgpd = () => {
    if (!state.currentUser) return;
    const now = new Date().toISOString();
    const updatedUser = {
      ...state.currentUser,
      lgpdAccepted: true,
      lgpdAcceptedAt: now
    };
    setState((prev) => ({
      ...prev,
      currentUser: updatedUser,
      users: prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    }));
  };

  const rejectLgpdAndLogout = () => {
    setState((prev) => ({
      ...prev,
      currentUser: null
    }));
  };

  const logout = () => {
    setState((prev) => ({
      ...prev,
      currentUser: null
    }));
  };

  // Add Course Manually (e cria disciplina/questão base caso o curso ainda não possua questões para simulado)
  const addCourse = (courseName) => {
    const cClean = (courseName || '').trim();
    if (!cClean) return null;
    setState((prev) => {
      const exists = prev.courses.some((c) => c.toLowerCase() === cClean.toLowerCase());
      const nextCourses = exists ? prev.courses : [...prev.courses, cClean];

      const hasCourseQuestions = prev.questions.some(
        (q) => (q.course || '').toLowerCase() === cClean.toLowerCase()
      );

      let nextDisciplines = prev.disciplines;
      let nextQuestions = prev.questions;

      if (!hasCourseQuestions) {
        const discName = `Componente Específico - ${cClean}`;
        const topicName = `Fundamentos e Práticas de ${cClean}`;
        nextDisciplines = [
          ...prev.disciplines,
          {
            id: `disc_${Date.now()}`,
            name: discName,
            course: cClean,
            topics: [topicName]
          }
        ];
        nextQuestions = [
          ...prev.questions,
          {
            id: `q_auto_${Date.now()}`,
            code: `Q-${String(prev.questions.length + 101).padStart(4, '0')}`,
            course: cClean,
            discipline: discName,
            topic: topicName,
            difficulty: 'Média',
            year: 'ENADE 2023',
            officialSource: `INEP/MEC - Diretrizes de Avaliação ENADE (${cClean})`,
            isUpdated: true,
            baseText: `Fonte Oficial: INEP/MEC (Matriz de Referência ENADE - ${cClean}).\nAs Diretrizes Curriculares Nacionais para o curso de ${cClean} enfatizam a articulação entre conhecimentos teóricos, resolução de problemas reais da profissão, tomada de decisão ética e responsabilidade socioambiental.`,
            statement: `Considerando o perfil do egresso e as competências avaliadas pelo ENADE para o curso de ${cClean}, a atuação profissional qualificada exige:`,
            options: [
              { letter: 'A', text: 'A aplicação isolada de procedimentos técnicos sem análise do contexto social ou ético.' },
              { letter: 'B', text: 'A visão sistêmica, crítica e ética na resolução de problemas complexos inerentes à área de ' + cClean + '.' },
              { letter: 'C', text: 'A reprodução mecânica de rotinas operacionais desvinculadas de planejamento.' },
              { letter: 'D', text: 'A restrição do aprendizado ao período acadêmico, dispensando atualização contínua.' },
              { letter: 'E', text: 'A tomada de decisão baseada exclusivamente em intuição, sem indicadores técnicos.' }
            ],
            correctOption: 'B',
            shortErrorReason: 'As matrizes do ENADE avaliam a capacidade crítica, ética e sistêmica na resolução de situações-problema da área.',
            explanation: {
              mainIdea: `Integrar competências técnicas, visão sistêmica e ética profissional na área de ${cClean}.`,
              steps: [
                'Analise os objetivos das Diretrizes Curriculares Nacionais (DCNs) e matrizes do ENADE.',
                'Elimine as alternativas que defendem atuação acrítica ou meramente mecânica (A, C, D e E).',
                'Confirme a alternativa B.'
              ],
              summary: `No ENADE, o perfil do profissional de ${cClean} combina domínio técnico-científico, visão crítica e responsabilidade social.`,
              videoUrl: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade',
              videoDuration: '2 min'
            },
            studyLinks: [
              {
                type: 'Portal Oficial',
                title: 'INEP/MEC - Provas e Matrizes do ENADE',
                url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade/provas-e-gabaritos'
              }
            ],
            status: 'aprovada_nde',
            peerValidated: true,
            peerReviewer: 'NDE Institucional',
            peerValidatedAt: 'Hoje',
            authorId: 'usr_prof_claudio',
            authorName: 'Banco Oficial ENADE',
            createdAt: new Date().toISOString(),
            comments: []
          }
        ];
      }

      return {
        ...prev,
        courses: nextCourses,
        disciplines: nextDisciplines,
        questions: nextQuestions
      };
    });
    return cClean;
  };

  // Delete Question (allows professor to delete a question after submitting for review or anytime)
  const deleteQuestion = (questionId) => {
    setState((prev) => ({
      ...prev,
      deletedQuestionIds: [...(prev.deletedQuestionIds || []), questionId],
      questions: prev.questions.filter((q) => q.id !== questionId),
      savedQuestionIds: prev.savedQuestionIds.filter((id) => id !== questionId)
    }));
  };

  // Disciplines & Topics by Course (US19)
  const ensureDisciplineAndTopic = (disciplineName, topicName, courseName = 'Geral') => {
    const dClean = (disciplineName || '').trim();
    const tClean = (topicName || '').trim();
    const cClean = (courseName || 'Geral').trim();
    if (!dClean) return;

    setState((prev) => {
      const existingDisc = prev.disciplines.find(
        (d) => d.name.toLowerCase() === dClean.toLowerCase()
      );
      let updatedDisciplines;
      if (existingDisc) {
        const hasTopic =
          tClean && existingDisc.topics.some((t) => t.toLowerCase() === tClean.toLowerCase());
        updatedDisciplines = prev.disciplines.map((d) =>
          d.id === existingDisc.id
            ? {
                ...d,
                course: d.course || cClean,
                topics: tClean && !hasTopic ? [...d.topics, tClean] : d.topics
              }
            : d
        );
      } else {
        updatedDisciplines = [
          ...prev.disciplines,
          {
            id: `disc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            name: dClean,
            course: cClean,
            topics: tClean ? [tClean] : []
          }
        ];
      }

      const updatedCourses =
        cClean && !prev.courses.includes(cClean) ? [...prev.courses, cClean] : prev.courses;

      return {
        ...prev,
        courses: updatedCourses,
        disciplines: updatedDisciplines
      };
    });
  };

  // Questions CRUD (US01, US02, US05, US18, US20, US21, US24)
  const saveQuestion = (questionData, submitForReview = false) => {
    const cClean = (questionData.course || state.currentUser?.course || 'ADS / Computação').trim();
    const dClean = (questionData.discipline || '').trim();
    const tClean = (questionData.topic || '').trim();
    if (dClean) {
      ensureDisciplineAndTopic(dClean, tClean, cClean);
    }

    let createdOrUpdated = null;
    setState((prev) => {
      const isEdit = Boolean(questionData.id);
      const nextNum = prev.questions.length + 1;
      const code = questionData.code || `Q-${String(nextNum).padStart(4, '0')}`;
      const status = submitForReview
        ? 'em_revisao'
        : questionData.status || 'rascunho';

      const record = {
        id: questionData.id || `q_${Date.now()}`,
        code,
        course: cClean,
        discipline: dClean,
        topic: tClean,
        difficulty: questionData.difficulty || 'Média',
        year: questionData.year || 'ENADE 2023',
        officialSource: questionData.officialSource || 'INEP/MEC - Banco Institucional ENADE',
        isUpdated: Boolean(questionData.isUpdated),
        baseText: questionData.baseText || '',
        statement: questionData.statement || '',
        options: questionData.options || [
          { letter: 'A', text: '' },
          { letter: 'B', text: '' },
          { letter: 'C', text: '' },
          { letter: 'D', text: '' },
          { letter: 'E', text: '' }
        ],
        correctOption: questionData.correctOption || 'A',
        shortErrorReason: questionData.shortErrorReason || '',
        explanation: {
          mainIdea: questionData.explanation?.mainIdea || '',
          steps: questionData.explanation?.steps || [],
          summary: questionData.explanation?.summary || '',
          videoUrl: questionData.explanation?.videoUrl || '',
          videoDuration: questionData.explanation?.videoDuration || '2 min'
        },
        studyLinks: questionData.studyLinks || [],
        status,
        peerValidated: questionData.peerValidated || false,
        peerReviewer: questionData.peerReviewer || null,
        peerValidatedAt: questionData.peerValidatedAt || null,
        peerFeedback: questionData.peerFeedback || '',
        ndeEvaluation: questionData.ndeEvaluation || null,
        authorId: questionData.authorId || prev.currentUser?.id || 'prof',
        authorName: questionData.authorName || prev.currentUser?.name || 'Professor',
        createdAt: questionData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: questionData.comments || [],
        errorReports: questionData.errorReports || []
      };

      createdOrUpdated = record;
      const updatedQuestions = isEdit
        ? prev.questions.map((q) => (q.id === record.id ? record : q))
        : [record, ...prev.questions];

      return {
        ...prev,
        questions: updatedQuestions
      };
    });

    return createdOrUpdated;
  };

  // Peer Review (US02)
  const reviewQuestionByPeer = (questionId, approved, feedback = '') => {
    const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          peerValidated: approved,
          peerReviewer: prev.currentUser?.name || 'Revisor Pares',
          peerValidatedAt: approved ? now : null,
          peerFeedback: feedback,
          status: approved ? 'validada_pares' : 'devolvida'
        };
      })
    }));
  };

  // NDE Governance Evaluation (US20)
  const evaluateQuestionByNDE = (questionId, evaluation) => {
    const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        const isApproved = evaluation.decision === 'aprovar';
        return {
          ...q,
          status:
            evaluation.decision === 'aprovar'
              ? 'aprovada_nde'
              : evaluation.decision === 'devolver'
              ? 'devolvida'
              : 'reprovada',
          peerValidated: isApproved ? true : q.peerValidated,
          peerValidatedAt: q.peerValidatedAt || (isApproved ? now : null),
          ndeEvaluation: {
            ...evaluation,
            evaluatedBy: prev.currentUser?.name || 'Coordenação / NDE',
            evaluatedAt: new Date().toISOString()
          }
        };
      })
    }));
  };

  // Record Student Question Attempt (US04, US06, US08, US09)
  const recordAttempt = ({ questionId, selectedOption, timeSpentSec = 45 }) => {
    const question = state.questions.find((q) => q.id === questionId);
    if (!question) return null;

    const isCorrect = selectedOption === question.correctOption;
    const todayStr = new Date().toISOString().slice(0, 10);

    const attempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: state.currentUser?.id || 'anon',
      userName: state.currentUser?.name || 'Aluno',
      userClass: state.currentUser?.className || 'Turma A',
      userCourse: question.course || state.currentUser?.course || 'Geral',
      questionId: question.id,
      course: question.course,
      discipline: question.discipline,
      topic: question.topic,
      selectedOption,
      correctOption: question.correctOption,
      isCorrect,
      timeSpentSec,
      timestamp: new Date().toISOString()
    };

    setState((prev) => {
      let nextStreak = prev.dailyStreak;
      if (prev.lastStudyDate !== todayStr) {
        nextStreak = prev.dailyStreak + 1;
      }

      const pointsEarned = isCorrect ? 15 : 5;
      const updatedUser = prev.currentUser
        ? {
            ...prev.currentUser,
            points: (prev.currentUser.points || 0) + pointsEarned
          }
        : null;

      return {
        ...prev,
        attempts: [attempt, ...prev.attempts],
        dailyStreak: nextStreak,
        lastStudyDate: todayStr,
        currentUser: updatedUser,
        users: updatedUser
          ? prev.users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
          : prev.users
      };
    });

    return attempt;
  };

  const saveCompletedSimulado = (simuladoRecord) => {
    setState((prev) => ({
      ...prev,
      simulados: [
        {
          id: `sim_${Date.now()}`,
          userId: prev.currentUser?.id || 'anon',
          date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          createdAt: new Date().toISOString(),
          ...simuladoRecord
        },
        ...prev.simulados
      ]
    }));
  };

  const saveSimuladoTemplate = (template) => {
    setState((prev) => ({
      ...prev,
      savedTemplates: [
        { id: `tpl_${Date.now()}`, createdAt: new Date().toISOString(), ...template },
        ...prev.savedTemplates
      ]
    }));
  };

  const toggleSaveQuestion = (questionId) => {
    setState((prev) => {
      const exists = prev.savedQuestionIds.includes(questionId);
      return {
        ...prev,
        savedQuestionIds: exists
          ? prev.savedQuestionIds.filter((id) => id !== questionId)
          : [...prev.savedQuestionIds, questionId]
      };
    });
  };

  const saveSummaryNote = ({ questionId, discipline, topic, summaryText }) => {
    setState((prev) => ({
      ...prev,
      savedNotes: [
        {
          id: `note_${Date.now()}`,
          userId: prev.currentUser?.id,
          questionId,
          discipline,
          topic,
          summaryText,
          createdAt: new Date().toISOString()
        },
        ...prev.savedNotes
      ]
    }));
  };

  const addQuestionComment = (questionId, text, parentId = null) => {
    if (!text.trim()) return;
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        const newComment = {
          id: `c_${Date.now()}`,
          authorName: prev.currentUser?.name || 'Estudante',
          authorRole: prev.currentUser?.role || 'aluno',
          text: text.trim(),
          parentId,
          createdAt: 'agora mesmo'
        };
        return {
          ...q,
          comments: [...(q.comments || []), newComment]
        };
      })
    }));
  };

  const reportQuestionError = (questionId, reason) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          errorReports: [
            ...(q.errorReports || []),
            {
              id: `err_${Date.now()}`,
              userName: prev.currentUser?.name || 'Aluno',
              reason,
              createdAt: new Date().toISOString()
            }
          ]
        };
      })
    }));
  };

  const recordProfessorDownload = (questionsToDownload, title = 'Lista de Questões ENADE', format = 'TXT') => {
    const content = questionsToDownload
      .map(
        (q, idx) =>
          `QUESTÃO ${idx + 1} (${q.code} | Curso: ${q.course || 'Geral'} | ${q.discipline} > ${q.topic} | ${q.year} | Dificuldade: ${q.difficulty})\n` +
          `Fonte Oficial: ${q.officialSource || 'INEP/MEC - ENADE'}\n` +
          (q.baseText ? `Texto-base: ${q.baseText}\n` : '') +
          `Enunciado: ${q.statement}\n` +
          q.options.map((o) => `${o.letter}) ${o.text}`).join('\n') +
          `\nGabarito Oficial: ${q.correctOption}\n` +
          `Resumo Pedagógico: ${q.explanation?.summary || q.explanation?.mainIdea || 'N/A'}\n` +
          `------------------------------------------------------------\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setState((prev) => ({
      ...prev,
      downloads: [
        {
          id: `dl_${Date.now()}`,
          professorId: prev.currentUser?.id,
          professorName: prev.currentUser?.name || 'Professor',
          title,
          questionCount: questionsToDownload.length,
          format,
          date: new Date().toLocaleDateString('pt-BR'),
          questionIds: questionsToDownload.map((q) => q.id)
        },
        ...prev.downloads
      ]
    }));
  };

  const addMatrix = ({ title, course, competencies }) => {
    setState((prev) => ({
      ...prev,
      matrices: [
        {
          id: `mat_${Date.now()}`,
          title,
          course: course || 'Geral',
          updatedAt: new Date().toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }),
          competencies: competencies || []
        },
        ...prev.matrices
      ]
    }));
  };

  const addCompetencyToMatrix = (matrixId, comp) => {
    setState((prev) => ({
      ...prev,
      matrices: prev.matrices.map((m) =>
        m.id === matrixId
          ? {
              ...m,
              competencies: [
                ...m.competencies,
                { id: `comp_${Date.now()}`, ...comp }
              ]
            }
          : m
      )
    }));
  };

  const addNdeAta = ({ title, summary }) => {
    setState((prev) => ({
      ...prev,
      ndeAtas: [
        {
          id: `ata_${Date.now()}`,
          date: new Date().toLocaleDateString('pt-BR'),
          title,
          summary,
          author: prev.currentUser?.name || 'Coordenador'
        },
        ...prev.ndeAtas
      ]
    }));
  };

  const addFlashcard = ({ discipline, topic, front, back }) => {
    ensureDisciplineAndTopic(discipline, topic);
    setState((prev) => ({
      ...prev,
      flashcards: [
        {
          id: `fc_${Date.now()}`,
          discipline,
          topic,
          front,
          back,
          createdBy: prev.currentUser?.name || 'Usuário'
        },
        ...prev.flashcards
      ]
    }));
  };

  const suggestRevisionClass = (alertItem, note) => {
    setState((prev) => ({
      ...prev,
      revisionSuggestions: [
        {
          id: `rev_${Date.now()}`,
          alertKey: alertItem.key,
          discipline: alertItem.discipline,
          topic: alertItem.topic,
          className: alertItem.className,
          errorPct: alertItem.errorPct,
          note,
          coordinatorName: prev.currentUser?.name || 'Coordenador',
          createdAt: new Date().toLocaleDateString('pt-BR')
        },
        ...prev.revisionSuggestions
      ]
    }));
  };

  const dismissAlert = (alertKey) => {
    setState((prev) => ({
      ...prev,
      dismissedAlertKeys: [...prev.dismissedAlertKeys, alertKey]
    }));
  };

  const updateAlertConfig = (newCfg) => {
    setState((prev) => ({
      ...prev,
      alertConfig: { ...prev.alertConfig, ...newCfg }
    }));
  };

  const exportCoordinatorReport = ({ title, format = 'CSV', filters, rows }) => {
    const csvContent =
      rows && rows.length > 0
        ? [
            Object.keys(rows[0]).join(','),
            ...rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(','))
          ].join('\n')
        : 'Curso,Turma,Disciplina,Topico,Acertos,TotalRespostas\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);

    setState((prev) => ({
      ...prev,
      exportedReports: [
        {
          id: `rep_${Date.now()}`,
          title,
          format,
          filters,
          createdAt: new Date().toLocaleString('pt-BR'),
          author: prev.currentUser?.name || 'Coordenador'
        },
        ...prev.exportedReports
      ]
    }));
  };

  const updatePreferences = (prefs) => {
    setState((prev) => ({ ...prev, ...prefs }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        authenticateWithPassword,
        registerInstitutionalUser,
        acceptLgpd,
        rejectLgpdAndLogout,
        logout,
        addCourse,
        deleteQuestion,
        ensureDisciplineAndTopic,
        saveQuestion,
        reviewQuestionByPeer,
        evaluateQuestionByNDE,
        recordAttempt,
        saveCompletedSimulado,
        saveSimuladoTemplate,
        toggleSaveQuestion,
        saveSummaryNote,
        addQuestionComment,
        reportQuestionError,
        recordProfessorDownload,
        addMatrix,
        addCompetencyToMatrix,
        addNdeAta,
        addFlashcard,
        suggestRevisionClass,
        dismissAlert,
        updateAlertConfig,
        exportCoordinatorReport,
        updatePreferences
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
