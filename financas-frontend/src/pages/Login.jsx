import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Wallet, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join('. '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Email ou senha incorretos. Tente novamente.');
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
          <p style={styles.subtitle}>Entre na sua conta</p>
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

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={20} style={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                required
                disabled={loading}
                style={{...styles.input, opacity: loading ? 0.6 : 1}}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* Link Cadastro */}
          <p style={styles.linkText}>
            Não tem uma conta?{' '}
            <Link to="/register" style={styles.link}>
              Cadastre-se
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
    maxWidth: '450px'
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

export default Login;