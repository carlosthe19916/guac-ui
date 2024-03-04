## Requisites

- Install Guacone
- Start GUAC

```shell
docker compose -f docker-compose.yml -f container_files/mem.yaml up --force-recreate
```

- Ingest data

```shell
guacone collect files guac-data-main/docs
```

## Spog UI

### Development mode

- Install dependencies

```shell
npm ci
```

- Start dev mode

```shell
npm run start:dev
```

- Open http://localhost:3000

### Environment variables

If needed, you can configure the ENV VARS. E.g.

```shell
export [VAR_NAME]=[VAR_VALUE]
```

| Description      | ENV VAR      | Defaul value          |
| ---------------- | ------------ | --------------------- |
| Set Guac API URL | GUAC_HUB_URL | http://localhost:8083 |
