import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthView } from './components/AuthView';
import { StudentView } from './components/StudentView';
import { ProfessorView } from './components/ProfessorView';
import { CoordinatorView } from './components/CoordinatorView';

const MainRouter = () => {
  const { state } = useApp();

  if (!state.currentUser || !state.currentUser.lgpdAccepted) {
    return <AuthView />;
  }

  const isDarkHeader =
    state.currentUser.role === 'professor' || state.currentUser.role === 'coordenador';

  const roleLabels = {
    aluno: 'ALUNO',
    professor: 'PROFESSOR',
    coordenador: 'COORDENADOR / NDE'
  };

  // Indicador de Perfil Autenticado (Sem alternância direta sem senha)
  const HeaderRoleBadge = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: isDarkHeader ? '#334155' : '#eff6ff',
        border: isDarkHeader ? '1px solid #475569' : '1px solid #bfdbfe',
        padding: '4px 10px',
        borderRadius: '8px',
        gap: '6px',
        fontSize: '0.76rem',
        fontWeight: 600,
        color: isDarkHeader ? '#e2e8f0' : 'var(--primary)'
      }}
      title="Sessão autenticada com senha e segregação de perfil"
    >
      <span>🔒 {roleLabels[state.currentUser.role]}</span>
      {state.currentUser.course && (
        <span style={{ opacity: 0.85 }}>· {state.currentUser.course}</span>
      )}
    </div>
  );

  if (state.currentUser.role === 'professor') {
    return <ProfessorView HeaderRoleSwitcher={HeaderRoleBadge} />;
  }

  if (state.currentUser.role === 'coordenador') {
    return <CoordinatorView HeaderRoleSwitcher={HeaderRoleBadge} />;
  }

  return <StudentView HeaderRoleSwitcher={HeaderRoleBadge} />;
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
