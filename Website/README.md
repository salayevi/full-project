# Website

Public website consumer for the Azizam Market system.

## Local run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3001

## Runtime contract

- Reads published content from `GET /api/v1/public/snapshot/`
- Reads preview content from `GET /api/v1/public/preview/<token>/snapshot/`
- Does not own content state
- Does not expose dashboard or admin workflows
