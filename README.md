# Présentation

Schoolx est LA solution de gestion de présence pour votre école démocratique.

> Comment est-ce possible ?

Vous dites-vous surement.

> Mon fichier excel est tellement bien pourtant, j'adore remplir ces petites cases chaque jour pendant 1h.

Vous dites-vous aussi. Nos développeurs (un seul pour le moment, on attend des invests pour embaucher) ont effectué une longue période d'immersion dans une école démocratique afin de VOUS apporter l'expertise que VOUS méritez. A l'écoute, attentif et l'oreille tendue, ils ont su comprendre votre besoin et ont ainsi pu établir un cahier des charges hors-normes ! Après plusieurs semaines de travail minutieux, nos développeurs sortent enfin la version 0.000001 de ce bête d'outil. Une version pre-alpha-crash-test que les critiques ont unanimement qualifié de "propre".



![inandout](https://github.com/petersg83/schoolx/assets/11708220/92141ba7-5d21-4c7c-bef6-f7cc3ee13ae6)


![calendar](https://github.com/petersg83/schoolx/assets/11708220/6fe7cf34-473f-4831-b19b-2c5c91b9ff54)


# Installation

Faite sur Ubuntu 20.04.6 Server

## Pré-requis
- NodeJS 20
- Postgres
- Yarn

### Cloner et installer le projet

```bash
git clone git@github.com:petersg83/schoolx.git
cd schoolx/backend
yarn install
cd ../frontend
yarn install
sudo npm install -g serve

cd src
cp config.js.dist config.js
nano config.js # modify with the correct api endpoint. ex: https://api.clickin.fr
cd ../../backend/src
cp config.js.dist config.js
nano config.js # modify with the  correct values (for password hash: https://www.bcrypt.fr/)
cd ..
yarn execute scripts/db-init.js # initiate the database
```

### Configurer nginx

Remplacez le fichier `/etc/nginx/nginx.conf` par :

```
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections 768;
}

http {

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 6M;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    gzip on;

  server {
    listen 80;
    return 301 https://$host$request_uri;
  }

  server {
    listen 443;
    server_name clickin.fr;

    ssl_certificate           /etc/letsencrypt/live/clickin.fr/fullchain.pem;
    ssl_certificate_key       /etc/letsencrypt/live/clickin.fr/privkey.pem;

    ssl on;
    ssl_session_cache  builtin:1000  shared:SSL:10m;
    ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
    ssl_prefer_server_ciphers on;

    access_log            /var/log/nginx/clickin.access.log;

    location / {
      proxy_set_header        Host $host;
      proxy_set_header        X-Real-IP $remote_addr;
      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header        X-Forwarded-Proto $scheme;
      proxy_set_header        Upgrade $http_upgrade;
      proxy_set_header        Connection "upgrade";
      proxy_http_version      1.1;

      proxy_pass          http://localhost:5000;
      proxy_read_timeout  90;

      # proxy_redirect      http://localhost:5000 https://clickin.fr;
    }
  }


    server {
      listen 443;
      server_name api.clickin.fr;

      ssl_certificate           /etc/letsencrypt/live/clickin.fr-0001/fullchain.pem;
      ssl_certificate_key       /etc/letsencrypt/live/clickin.fr-0001/privkey.pem;

      ssl on;
      ssl_session_cache  builtin:1000  shared:SSL:10m;
      ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;
      ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
      ssl_prefer_server_ciphers on;

      access_log            /var/log/nginx/clickin.access.log;

      location / {
        proxy_set_header        Host $host;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_set_header        Upgrade $http_upgrade;
        proxy_set_header        Connection "upgrade";
        proxy_http_version      1.1;

        proxy_pass          http://localhost:3000;
        proxy_read_timeout  90;

        # proxy_redirect      http://localhost:3000 https://clickin.fr;
      }
    }

  server {
    listen 443;
    server_name *.clickin.fr;

    ssl_certificate           /etc/letsencrypt/live/clickin.fr-0001/fullchain.pem;
    ssl_certificate_key       /etc/letsencrypt/live/clickin.fr-0001/privkey.pem;

    ssl on;
    ssl_session_cache  builtin:1000  shared:SSL:10m;
    ssl_protocols  TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!eNULL:!EXPORT:!CAMELLIA:!DES:!MD5:!PSK:!RC4;
    ssl_prefer_server_ciphers on;

    access_log            /var/log/nginx/clickin.access.log;

    location / {
      proxy_set_header        Host $host;
      proxy_set_header        X-Real-IP $remote_addr;
      proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header        X-Forwarded-Proto $scheme;
      proxy_set_header        Upgrade $http_upgrade;
      proxy_set_header        Connection "upgrade";
      proxy_http_version      1.1;

      proxy_pass          http://localhost:5000;
      proxy_read_timeout  90;

      # proxy_redirect      http://localhost:5000 https://clickin.fr;
    }
  }

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

Adaptez :

- le chemin vers les certificats

- les ports

- le ndd

Redémarrez nginx :

```bash
sudo service nginx reload
```

### Installer pm2

```bash
sudo npm install -g pm2
```

### Éxecution avec pm2

Dans le dossier `backend`, faites la commande :

```bash
pm2 -n back start "yarn start"
```

Dans le dossier `frontend`, faites les commandes :

```bash
yarn build
pm2 -n front start "serve -s build"
```
