# Builder image
FROM registry.access.redhat.com/ubi9/nodejs-18:latest as builder

USER 1001
COPY --chown=1001 . .
RUN npm clean-install && npm run build && npm run dist

# Runner image
FROM registry.access.redhat.com/ubi9/nodejs-18-minimal:latest

# Add ps package to allow liveness probe for k8s cluster
# Add tar package to allow copying files with kubectl scp
USER 0
RUN microdnf -y install tar procps-ng && microdnf clean all

USER 1001

LABEL name="guacsec/guac-ui" \
      description="GUAC User Interface" \
      help="For more information visit https://guac.sh/" \
      license="Apache License 2.0" \
      maintainer="carlosthe19916@gmail.com" \
      summary="GUAC - User Interface" \
      url="https://quay.io/repository/carlosthe19916/guac-ui" \
      usage="podman run -p 80 -v carlosthe19916/guac-ui:latest" \      
      io.k8s.display-name="guac-ui" \
      io.k8s.description="GUAC - User Interface" \
      io.openshift.expose-services="80:http" \
      io.openshift.tags="operator,guac,ui,nodejs18" \
      io.openshift.min-cpu="100m" \
      io.openshift.min-memory="350Mi"

COPY --from=builder /opt/app-root/src/dist /opt/app-root/dist/

ENV DEBUG=1

WORKDIR /opt/app-root/dist
ENTRYPOINT ["./entrypoint.sh"]
