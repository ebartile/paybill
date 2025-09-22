FROM paybilldev/paybill-ce:latest

# Install Postgres
USER root
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ bullseye-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list
RUN echo "deb http://deb.debian.org/debian"
RUN apt update && apt -y install postgresql-13 postgresql-client-13 supervisor
USER postgres
RUN service postgresql start && \
    psql -c "create role paybilldev with login superuser password 'postgres';"
USER root

RUN echo "[supervisord] \n" \
    "nodaemon=true \n" \
    "\n" \
    "[program:paybilldev] \n" \
    "command=/bin/bash -c '/app/paybill/scripts/init-db-boot.sh' \n" \
    "autostart=true \n" \
    "autorestart=true \n" \
    "stderr_logfile=/dev/stdout \n" \
    "stderr_logfile_maxbytes=0 \n" \
    "stdout_logfile=/dev/stdout \n" \
    "stdout_logfile_maxbytes=0 \n" | sed 's/ //' > /etc/supervisor/conf.d/supervisord.conf

# ENV defaults
ENV PAYBILL_HOST=http://localhost \
    PORT=80 \
    NODE_ENV=production \
    PG_DB=paybilldev_production \
    PG_USER=paybilldev \
    PG_PASS=postgres \
    PG_HOST=localhost \
    PB_DB_HOST=localhost \
    PB_DB_USER=paybilldev \
    PB_DB_PASS=postgres \
    PB_DB=paybilldev_db \
    DEPLOYMENT_PLATFORM=docker:local \
    HOME=/home/appuser

# Prepare DB and start application
ENTRYPOINT service postgresql start 1> /dev/null && /usr/bin/supervisord