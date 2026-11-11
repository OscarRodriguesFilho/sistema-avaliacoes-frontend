# Sistema de Avaliações — Frontend

Aplicação React/Vite autenticada pelo Auth0. Usuários `USER` e `ADMIN` veem avaliações; apenas `ADMIN` vê o formulário de cadastro.

## Variáveis

Copie `.env.example` para `.env.local` e preencha. No Auth0, registre as URLs local e da Vercel em **Allowed Callback URLs**, **Allowed Logout URLs** e **Allowed Web Origins**.

## Vercel

Importe o repositório e defina as quatro variáveis `VITE_*` em Settings → Environment Variables. A Vercel executará `npm run build` automaticamente.
