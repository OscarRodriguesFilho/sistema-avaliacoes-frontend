import { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './styles.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
if (!domain || !clientId || !audience) throw new Error('Configure VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID e VITE_AUTH0_AUDIENCE.');
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() { return this.state.error ? <main className="landing"><h1>Não foi possível iniciar o sistema</h1><p>{this.state.error.message}</p></main> : this.props.children; }
}
createRoot(document.getElementById('root')).render(
  <StrictMode><ErrorBoundary><Auth0Provider domain={domain} clientId={clientId} authorizationParams={{ redirect_uri: window.location.origin, audience, scope: 'openid profile email USER ADMIN' }}><App /></Auth0Provider></ErrorBoundary></StrictMode>
);
