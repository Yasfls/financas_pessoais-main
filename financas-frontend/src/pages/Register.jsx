import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Wallet, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validação de senha
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allRequirementsMet) {
      setError('A senha não atende todos os requisitos de segurança');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      await register(nome, email, password, confirmPassword);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no registro:', err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join('. '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <Wallet size={40} style={{ color: 'white' }} />
          </div>
          <h1 style={styles.title}>Finanças Pessoais</h1>
          <p style={styles.subtitle}>Crie sua conta</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Erro */}
          {error && (
            <div style={styles.errorBox}>
              <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          {/* Nome */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome Completo</label>
            <div style={styles.inputWrapper}>
              <User size={20} style={styles.inputIcon} />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                required
                disabled={loading}
                style={{...styles.input, opacity: loading ? 0.6 : 1}}
              />
            </div>
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={20} style={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
                style={{...styles.input, opacity: loading ? 0.6 : 1}}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Senha */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                style={{...styles.input, opacity: loading ? 0.6 : 1}}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Requisitos de Senha */}
          {password.length > 0 && (
            <div style={styles.requirementsBox}>
              <p style={styles.requirementsTitle}>Requisitos da senha:</p>
              <div style={styles.requirement}>
                <span style={{color: passwordRequirements.minLength ? '#10b981' : '#9ca3af'}}>
                  {passwordRequirements.minLength ? '✓' : '○'}
                </span>
                <span style={{color: passwordRequirements.minLength ? '#374151' : '#9ca3af', fontSize: '13px'}}>
                  Mínimo de 8 caracteres
                </span>
              </div>
              <div style={styles.requirement}>
                <span style={{color: passwordRequirements.hasUpper ? '#10b981' : '#9ca3af'}}>
                  {passwordRequirements.hasUpper ? '✓' : '○'}
                </span>
                <span style={{color: passwordRequirements.hasUpper ? '#374151' : '#9ca3af', fontSize: '13px'}}>
                  Letra maiúscula
                </span>
              </div>
              <div style={styles.requirement}>
                <span style={{color: passwordRequirements.hasLower ? '#10b981' : '#9ca3af'}}>
                  {passwordRequirements.hasLower ? '✓' : '○'}
                </span>
                <span style={{color: passwordRequirements.hasLower ? '#374151' : '#9ca3af', fontSize: '13px'}}>
                  Letra minúscula
                </span>
              </div>
              <div style={styles.requirement}>
                <span style={{color: passwordRequirements.hasNumber ? '#10b981' : '#9ca3af'}}>
                  {passwordRequirements.hasNumber ? '✓' : '○'}
                </span>
                <span style={{color: passwordRequirements.hasNumber ? '#374151' : '#9ca3af', fontSize: '13px'}}>
                  Número
                </span>
              </div>
              <div style={styles.requirement}>
                <span style={{color: passwordRequirements.hasSpecial ? '#10b981' : '#9ca3af'}}>
                  {passwordRequirements.hasSpecial ? '✓' : '○'}
                </span>
                <span style={{color: passwordRequirements.hasSpecial ? '#374151' : '#9ca3af', fontSize: '13px'}}>
                  Caractere especial (!@#$%^&*)
                </span>
              </div>
              {allRequirementsMet && (
                <div style={{...styles.requirement, color: '#10b981', fontWeight: '600', marginTop: '8px'}}>
                  <CheckCircle size={16} />
                  <span style={{fontSize: '13px'}}>Senha forte! ✓</span>
                </div>
              )}
            </div>
          )}

          {/* Confirmar Senha */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Senha</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} style={styles.inputIcon} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                style={{...styles.input, opacity: loading ? 0.6 : 1}}
                autoComplete="new-password"
              />
            </div>
            {confirmPassword.length > 0 && (
              <span style={{fontSize: '12px', color: passwordsMatch ? '#10b981' : '#dc2626'}}>
                {passwordsMatch ? '✓ As senhas coincidem!' : '✗ As senhas não coincidem'}
              </span>
            )}
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading || !allRequirementsMet || !passwordsMatch}
            style={{
              ...styles.button,
              opacity: (loading || !allRequirementsMet || !passwordsMatch) ? 0.5 : 1,
              cursor: (loading || !allRequirementsMet || !passwordsMatch) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>

          {/* Link Login */}
          <p style={styles.linkText}>
            Já tem uma conta?{' '}
            <Link to="/login" style={styles.link}>
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  logoIcon: {
    display: 'inline-flex',
    padding: '16px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '16px',
    marginBottom: '16px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '14px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#9ca3af',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s',
    outline: 'none',
    fontFamily: 'inherit'
  },
  requirementsBox: {
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  requirementsTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  requirement: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s',
    marginTop: '8px'
  },
  linkText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px'
  },
  link: {
    color: '#10b981',
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default Register;