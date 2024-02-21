export AUTH_REQUIRED=true
export OIDC_SERVER_URL=https://sso.staging.trustification.dev/realms/chicken
export TRUSTIFICATION_HUB_URL=https://api.staging.trustification.dev

npm install
cd client/ && npm install @carlosthe19916-latest/react-table-batteries --save --legacy-peer-deps
cd .. && npm run start:dev
close ide
open ide
npm run start:dev
