import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL;
const emptyForm = { emailAvaliador: '', emailAvaliado: '', comentarios: '', nota: '' };
function hasAdminRole(user) { return (user?.['https://avaliacoes.insper.br/roles'] || []).includes('ADMIN'); }
export default function App() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
  const [avaliacoes, setAvaliacoes] = useState([]), [form, setForm] = useState(emptyForm), [error, setError] = useState(''), [message, setMessage] = useState(''), [loading, setLoading] = useState(false);
  const request = useCallback(async (path, options = {}) => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${apiUrl}${path}`, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
    if (!response.ok) throw new Error((await response.json().catch(() => null))?.message || 'Não foi possível concluir a solicitação.');
    return response.status === 204 ? null : response.json();
  }, [getAccessTokenSilently]);
  const load = useCallback(async () => { try { setLoading(true); setError(''); setAvaliacoes(await request('/avaliacoes')); } catch (e) { setError(e.message); } finally { setLoading(false); } }, [request]);
  useEffect(() => { if (isAuthenticated) load(); }, [isAuthenticated, load]);
  async function submit(event) { event.preventDefault(); try { setError(''); setMessage(''); await request('/avaliacoes', { method: 'POST', body: JSON.stringify({ ...form, nota: Number(form.nota) }) }); setForm(emptyForm); setMessage('Avaliação cadastrada.'); load(); } catch (e) { setError(e.message); } }
  if (isLoading) return <main><p>Carregando…</p></main>;
  if (!isAuthenticated) return <main className="landing"><h1>Sistema de Avaliações</h1><p>Consulte e registre avaliações da equipe com segurança.</p><button onClick={() => loginWithRedirect()}>Entrar com Auth0</button></main>;
  const admin = hasAdminRole(user);
  return <main><header><div><h1>Sistema de Avaliações</h1><p>{user?.email}</p></div><button className="secondary" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Sair</button></header>{error && <p className="alert error">{error}</p>}{message && <p className="alert success">{message}</p>}{admin && <section><h2>Nova avaliação</h2><form onSubmit={submit}><input type="email" required placeholder="E-mail do avaliador" value={form.emailAvaliador} onChange={e => setForm({...form, emailAvaliador: e.target.value})}/><input type="email" required placeholder="E-mail do avaliado" value={form.emailAvaliado} onChange={e => setForm({...form, emailAvaliado: e.target.value})}/><input type="number" required min="0" max="10" placeholder="Nota (0 a 10)" value={form.nota} onChange={e => setForm({...form, nota: e.target.value})}/><textarea required maxLength="2000" placeholder="Comentários" value={form.comentarios} onChange={e => setForm({...form, comentarios: e.target.value})}/><button>Salvar avaliação</button></form></section>}<section><h2>Avaliações</h2>{loading ? <p>Carregando avaliações…</p> : <div className="cards">{avaliacoes.map(a => <article key={a.id}><strong>{a.nota}/10</strong><p>{a.comentarios}</p><small>{a.emailAvaliador} avaliou {a.emailAvaliado}<br/>{new Date(a.dataAvaliacao).toLocaleString('pt-BR')}</small></article>)}{!avaliacoes.length && <p>Nenhuma avaliação cadastrada.</p>}</div>}</section></main>;
}
