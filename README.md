# Flow & Remember Me — Thrive demo

Demo Checkout.com **Flow** pour Thrive Newport Beach.

L’application montre :

- **Boost Performance and Conversion** — simulation multi-pays (flags) avec création de Payment Sessions adaptées (currency, `processing_channel_id`, billing, locale, etc.)
- **Brand It Your Way** — bascule entre marchands fictifs (GO Deliver, TravelMe, Pagoda, Solar, Pureglow Lab, A7 Entertainment, WALLE) avec un résumé de commande dynamique à droite ; Flow reste à gauche

## Architecture

```
Amplify Hosting (front statique)
        │
        │  API_BASE_URL
        ▼
API Gateway HTTP API  →  AWS Lambda
                              │
                              ▼
                     Checkout.com sandbox API
```

| Couche | Techno | Rôle |
|---|---|---|
| Front | HTML / CSS / JS dans `public/` | UI + Checkout Web Components (Flow) |
| Build front | `npm run build` → `dist/` | Injecte `runtime-config.js` (`API_BASE_URL`) |
| Back local | Express (`server.js`) | Dev local (front + API) |
| Back prod | Lambda + API Gateway (`template.yaml`) | `/config`, `/create-payment-sessions`, `/health` |

## Prérequis

- Node.js ≥ 18
- Compte Checkout.com sandbox (`pk_sbox_…`, `sk_sbox_…`)
- Pour le déploiement API : [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) + credentials AWS
- Pour le front : application Amplify Hosting connectée au repo

## Configuration

Copier `.env.example` vers `.env` pour le local :

```bash
cp .env.example .env
```

| Variable | Où | Description |
|---|---|---|
| `CHECKOUT_PUBLIC_KEY` | Local + Lambda | Clé publique Checkout |
| `CHECKOUT_SECRET_KEY` | Local + Lambda | Clé secrète Checkout (**jamais** sur Amplify) |
| `APP_BASE_URL` | Local + Lambda | URL du front (success / failure redirects) |
| `CORS_ORIGINS` | Local + Lambda | Origine(s) autorisées (URL Amplify) |
| `API_BASE_URL` | **Amplify build only** | URL API Gateway (sans slash final) |
| `PORT` | Local | Port Express (défaut `3000`) |

## Démarrage local

```bash
npm install
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000).

En local, front et API sont sur la même origine : laisser `API_BASE_URL` vide.

## Déploiement

### 1. Backend (Lambda + API Gateway)

```bash
# Installer SAM si besoin (macOS)
brew install aws-sam-cli

# Credentials AWS
aws configure   # ou aws login
aws sts get-caller-identity

# Premier déploiement (interactif)
npm run deploy:api:guided
```

Paramètres utiles pendant le guided deploy :

- `CheckoutPublicKey` / `CheckoutSecretKey`
- `AppBaseUrl` = URL Amplify (ex. `https://main.xxx.amplifyapp.com`)
- `CorsOrigins` = même URL Amplify
- Allow SAM CLI IAM role creation : **Y**
- Disable rollback : **N**

À la fin, noter l’output **`ApiBaseUrl`** :

```text
https://xxxxxxxx.execute-api.us-east-1.amazonaws.com
```

Mises à jour suivantes :

```bash
npm run deploy:api
```

Vérification :

```bash
curl https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/health
curl https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/config
```

### 2. Frontend (Amplify)

Dans Amplify → **Environment variables** (build) :

| Key | Value |
|---|---|
| `API_BASE_URL` | `https://xxxxxxxx.execute-api.us-east-1.amazonaws.com` |

Important : le **Value** doit être **uniquement** l’URL (sans préfixe `API_BASE_URL=`).

Build Amplify (via `amplify.yml`) :

```bash
npm run build
```

Artefacts : répertoire `dist/`.

Après changement de `API_BASE_URL`, **redeploy** Amplify, puis vérifier :

```text
https://<ton-app>.amplifyapp.com/runtime-config.js
```

Doit contenir :

```js
window.RUNTIME_CONFIG = {
  API_BASE_URL: "https://xxxxxxxx.execute-api.us-east-1.amazonaws.com",
};
```

## Structure du repo

```text
public/                 # Front (UI, Flow, brands, pays)
lib/
  country-sessions.js   # Overrides Payment Session par pays
  checkout-api.js       # Logique API partagée
lambda/handler.js       # Entrée Lambda
server.js               # Express local
scripts/build-frontend.js
template.yaml           # SAM (Lambda + HTTP API)
amplify.yml             # Build Amplify
```

## Notes

- Les Payment Sessions sandbox sont créées côté serveur uniquement (secret key).
- Flow n’est pas encore customisé via `appearance` (prévu plus tard pour Brand It Your Way).
- L’API Gateway est publique (pas d’auth) : acceptable pour une demo sandbox, pas pour la prod.
