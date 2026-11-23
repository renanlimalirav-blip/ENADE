import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, HelpCircle, Lock, Mail, UserPlus, LogIn, ShieldAlert, KeyRound } from 'lucide-react';

export const AuthView = () => {
  const {
    state,
    authenticateWithPassword,
    registerInstitutionalUser,
    addCourse,
    acceptLgpd,
    rejectLgpdAndLogout
  } = useApp();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('aluno'); // 'aluno' | 'professor' | 'coordenador'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('ADS / Computação');
  const [customCourse, setCustomCourse] = useState('');
  const [className, setClassName] = useState('6º ADS-A');

  const [authError, setAuthError] = useState('');
  const [ssoError, setSsoError] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // LGPD Modal state
  const [lgpdChecked, setLgpdChecked] = useState(false);
  const [showFullLgpd, setShowFullLgpd] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setSsoError(false);

    if (authMode === 'login') {
      const res = authenticateWithPassword({
        email,
        password,
        selectedRole: role
      });
      if (!res.ok) {
        setAuthError(res.error);
      }
    } else {
      const finalCourse =
        course === '__novo_curso__' && customCourse.trim()
          ? addCourse(customCourse.trim())
          : course;
      const res = registerInstitutionalUser({
        name,
        email,
        password,
        role,
        course: finalCourse || 'ADS / Computação',
        className
      });
      if (!res.ok) {
        setAuthError(res.error);
      }
    }
  };

  const needsLgpdModal = state.currentUser && !state.currentUser.lgpdAccepted;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)'
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '32px 30px',
          textAlign: 'center',
          borderRadius: '16px',
          boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.08)'
        }}
      >
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--primary)',
            marginBottom: '8px',
            letterSpacing: '-0.03em'
          }}
        >
          ENADE+
        </div>
        <h1
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '18px',
            lineHeight: 1.4
          }}
        >
          Prepare-se para o ENADE com questões comentadas e seu progresso
        </h1>

        {/* Alternância Entrar vs Cadastrar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '18px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setAuthError('');
            }}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: authMode === 'login' ? '#fff' : 'transparent',
              color: authMode === 'login' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: authMode === 'login' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <LogIn size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Login Institucional (SSO)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setAuthError('');
            }}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: authMode === 'register' ? '#fff' : 'transparent',
              color: authMode === 'register' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: authMode === 'register' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <UserPlus size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Novo Cadastro Institucional
          </button>
        </div>

        {/* Alerta de Erro de Permissão / Senha */}
        {authError && (
          <div
            style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger)',
              padding: '12px 14px',
              borderRadius: '10px',
              marginBottom: '16px',
              textAlign: 'left',
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{authError}</div>
          </div>
        )}

        {/* Alerta de Erro de SSO (Protótipo) */}
        {ssoError && (
          <div
            style={{
              background: 'var(--danger-bg)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger)',
              padding: '14px',
              borderRadius: '10px',
              marginBottom: '16px',
              textAlign: 'left',
              fontSize: '0.86rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '6px' }}>
              <AlertCircle size={18} />
              Não foi possível entrar
            </div>
            <p style={{ marginBottom: '10px' }}>
              O provedor de autenticação institucional (SSO) não respondeu. Tente novamente.
            </p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setSsoError(false)}
            >
              Tentar novamente
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {/* Seleção de Perfil Exclusivo */}
          <div className="form-group">
            <label className="form-label">
              Perfil de Acesso (Segregado por Credencial)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'aluno', label: 'Aluno' },
                { id: 'professor', label: 'Professor' },
                { id: 'coordenador', label: 'Coordenador' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRole(r.id);
                    setAuthError('');
                  }}
                  style={{
                    padding: '9px 8px',
                    borderRadius: '8px',
                    border: role === r.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: role === r.id ? 'var(--primary-light)' : '#fff',
                    color: role === r.id ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              🔒 Cada login possui acesso exclusivo a um único perfil (Professores e Coordenadores não compartilham login).
            </span>
          </div>

          {authMode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2" style={{ gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Curso Vinculado *</label>
                  <select
                    className="form-select"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  >
                    {state.courses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__novo_curso__">+ Adicionar novo curso...</option>
                  </select>
                  {course === '__novo_curso__' && (
                    <input
                      type="text"
                      className="form-input"
                      style={{ marginTop: '6px' }}
                      placeholder="Nome do novo curso..."
                      value={customCourse}
                      onChange={(e) => setCustomCourse(e.target.value)}
                      required
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Turma / Lotação</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: 6º ADS-A"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Login Institucional (E-mail) *</label>
            <input
              type="email"
              className="form-input"
              placeholder={
                role === 'aluno'
                  ? 'luan@faculdade.edu.br'
                  : role === 'professor'
                  ? 'claudio.veras@faculdade.edu.br'
                  : 'ricardo.coord@faculdade.edu.br'
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha *</label>
            <input
              type="password"
              className="form-input"
              placeholder="Digite sua senha institucional"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '6px', padding: '12px' }}
          >
            {authMode === 'login'
              ? 'Entrar com conta da faculdade (SSO)'
              : 'Cadastrar e entrar'}
          </button>
        </form>

        {/* Painel de Credenciais Institucionais Pré-Cadastradas para Teste Rápido */}
        <div
          style={{
            marginTop: '18px',
            textAlign: 'left',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '14px'
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <KeyRound size={14} color="var(--primary)" />
            Contas Institucionais Cadastradas (Clique para preencher login e senha):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '175px', overflowY: 'auto' }}>
            {state.users.map((u) => (
              <div
                key={u.id}
                onClick={() => {
                  setAuthMode('login');
                  setRole(u.role);
                  setEmail(u.email);
                  setPassword(u.password);
                  setAuthError('');
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc',
                  fontSize: '0.77rem',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <strong>{u.name}</strong> ({u.course})
                  <div style={{ color: 'var(--text-muted)' }}>
                    Login: <code>{u.email}</code> · Senha: <code>{u.password}</code>
                  </div>
                </div>
                <span
                  className={`badge ${
                    u.role === 'coordenador'
                      ? 'badge-danger'
                      : u.role === 'professor'
                      ? 'badge-atualizada'
                      : 'badge-validada'
                  }`}
                >
                  {u.role.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Precisa de ajuda?{' '}
            <button
              type="button"
              onClick={() => setShowSupportModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: 500,
                padding: 0
              }}
            >
              Contato da TI
            </button>
          </span>
          <button
            type="button"
            onClick={() => setSsoError(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Simular erro de SSO
          </button>
        </div>
      </div>

      {/* MODAL NO 1º ACESSO: TERMO DE USO E PROTEÇÃO DE DADOS (LGPD) - US11 / RNF06 */}
      {needsLgpdModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Termo de uso e proteção de dados (LGPD)
              </h2>
              <span className="badge badge-atualizada">Obrigatório</span>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px',
                marginBottom: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {[
                { num: 1, title: 'Quais dados coletamos', desc: 'Nome institucional, matrícula/e-mail acadêmico, curso, turma e histórico de respostas em simulados.' },
                { num: 2, title: 'Para que usamos', desc: 'Cálculo de métricas de evolução individual, geração de plano de revisão personalizado e estatísticas agregadas por turma para a coordenação.' },
                { num: 3, title: 'Por quanto tempo guardamos', desc: 'Durante o vínculo acadêmico ativo do estudante com a instituição ou até solicitação de revogação.' },
                { num: 4, title: 'Seus direitos', desc: 'Acesso, correção, anonimização em rankings opcionais, portabilidade e exclusão conforme Art. 18 da Lei nº 13.709/2018 (LGPD).' },
                { num: 5, title: 'Contato do encarregado de dados (DPO)', desc: 'dpo@instituicao.edu.br • Canal de Privacidade e Segurança da Informação.' }
              ].map((item) => (
                <div key={item.num} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--info-bg)',
                      color: 'var(--primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      flexShrink: 0
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      {item.title}
                    </div>
                    {showFullLgpd && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={lgpdChecked}
                  onChange={(e) => setLgpdChecked(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span>Li e aceito o termo</span>
              </label>

              <button
                type="button"
                onClick={() => setShowFullLgpd(!showFullLgpd)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {showFullLgpd ? 'Recolher detalhes' : 'Ler completo'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={rejectLgpdAndLogout}
              >
                Recusar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!lgpdChecked}
                onClick={acceptLgpd}
              >
                Aceitar e entrar
              </button>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '12px' }}>
              O botão fica ativo só com a caixa marcada. Recusar encerra a sessão.
            </div>
          </div>
        </div>
      )}

      {/* Modal de Contato da TI */}
      {showSupportModal && (
        <div className="modal-backdrop" onClick={() => setShowSupportModal(false)}>
          <div className="modal-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={20} color="var(--primary)" /> Suporte de TI Institucional
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Para problemas com seu login acadêmico (SSO) ou redefinição de credenciais institucionais, entre em contato com o Service Desk:
            </p>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '0.86rem', marginBottom: '16px' }}>
              <div><strong>E-mail:</strong> suporte.ti@faculdade.edu.br</div>
              <div><strong>Ramal / WhatsApp:</strong> (11) 4002-8922</div>
              <div><strong>Encarregado LGPD (DPO):</strong> dpo@faculdade.edu.br</div>
            </div>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowSupportModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
