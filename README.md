## Spog UI

### Environment variables

If needed, you can configure the ENV VARS. E.g.

```shell
export [VAR_NAME]=[VAR_VALUE]
```

| Description                   | ENV VAR                | Defaul value                         |
| ----------------------------- | ---------------------- | ------------------------------------ |
| Enable/Disable authentication | AUTH_REQUIRED          | false                                |
| Set Oidc Client               | OIDC_CLIENT_ID         | frontend                             |
| Set Oidc Server URL           | OIDC_SERVER_URL        | http://localhost:8090/realms/chicken |
| Set Trustification API URL    | TRUSTIFICATION_HUB_URL | http://localhost:8083                |
