# Présentation

Schoolx est LA solution de gestion de présence pour votre école démocratique.

> Comment est-ce possible ?

Vous dites-vous surement.

> Mon fichier excel est tellement bien pourtant, j'adore remplir ces petites cases chaque jour pendant 1h.

Vous dites-vous aussi. Nos développeurs (un seul pour le moment, on attend des invests pour embaucher) ont effectué une longue période d'immersion dans une école démocratique afin de VOUS apporter l'expertise que VOUS méritez. A l'écoute, attentif et l'oreille tendue, ils ont su comprendre votre besoin et ont ainsi pu établir un cahier des charges hors-normes ! Après plusieurs semaines de travail minutieux, nos développeurs sortent enfin la version 0.000001 de ce bête d'outil. Une version pre-alpha-crash-test que les critiques ont unanimement qualifié de "propre".

# Installation

Faite sur Ubuntu 18.04 Server

### Installer node

```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Installer postgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -i -u postgres
$postgres createuser --interactive # entrer : pierre, n, y, n
$postgres createdb pierre # pour éviter les warnings. Mettre son nom linux.
$postgres exit
createdb schoolx
psql
$pierre ALTER USER pierre WITH PASSWORD 'new_password'; # mettre un mot de passe. Remplacer son nom linux.
$pierre \q
sudo su
$root nano /etc/postgresql/10/main/postgresql.conf # add (or uncomment) the line listen_addresses = '*'
$root nano /etc/postgresql/10/main/pg_hba.conf
# modify the ip adresses to have those 2 lines
# host    all             all             0.0.0.0/0            md5
# host    all             all             ::0/0                md5
$root exit
sudo service postgresql restart
```

### Installer nginx

```bash
sudo apt install nginx
```

### Installer les certificats

```bash
sudo apt update
sudo apt install python-minimal
sudo apt install git-core
cd /opt
sudo git clone https://github.com/certbot/certbot.git
cd certbot && ./certbot-auto # entrer votre nnd et choisir de rediriger http vers https
sudo /opt/certbot-auto certonly \
    --server https://acme-v02.api.letsencrypt.org/directory \
    --manual -d *.clickin.fr -d clickin.fr # adapter avec votre adresse mail et votre ndd
# hint: dans vos DNS c'est la ligne _acme-challenge.clickin.fr. 3600 TXT "CLE_DONNEE_PAR_CERBOT" en adaptant la clé et le ndd
```

### Créer une clée SSH & autorisation Github

Créer la clée ssh du server :

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" #Cliquer sur entrer jusqu'à la création de la clé.
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

Autoriser le server à accéder à Github :

```bash
cat ~/.ssh/id_rsa.pub
```

Allez sur github et ajouter la clée affichée

### Installer yarn

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

### Cloner et installer le projet

```bash
git clone git@github.com:petersg83/schoolx.git
cd schoolx/backend
yarn install
cd ../frontend
yarn install
npm install -g serve

cd src
cp config.js.dist config.js
nano config.js # modify with the correct api endpoint. ex: https://api.clickin.fr
cd ../../backend/src
cp config.js.dist config.js
nano config.js # modify with the  correct values (for password hash: https://www.bcrypt.fr/)
```

### Configurez nginx

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

## Éxecution avec pm2

Dans le dossier `back`, faites la commande :

```bash
pm2 -n back start "yarn start"
```

Dans le dossier `front`, faites les commandes :

```bash
yarn build
pm2 -n front start "serve -s build"
```

## Backup avec gdrive

Si vous souhaitez mettre des backups en place et les stocker en sécurité sur votre Google Drive (oui c'est pas très éthique tout ça...).

### Installer gdrive

```bash
mkdir -p ~/bin
cd ~/bin
curl https://doc-08-48-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/9fgopm5t5oemi6oc7k0js0pjhsndgc0p/1549130400000/15876260727594163214/*/0B3X9GlR6EmbnQ0FtZmJJUXEyRTA > gdrive
chmod u+x gdrive
echo "export PATH=\"\$PATH:\$HOME/bin\"" >> ~/.bashrc
source ~/.bashrc
gdrive about # follow the link and enter the verification code
```

### Créer le dossier de sauvegarde

```bash
gdrive mkdir backups # store the backupsDirectoryId somewhere. Id ex: 1QI7qSIRO6Nj32G4TCM_OKz7-hoPr5d3F
gdrive mkdir schoolx -p 1QI7qSIRO6Nj32G4TCM_OKz7-hoPr5d3F # replace the id with your backupsDirectoryId and store schoolxDirectoryId somewhere

# Go to the schoolx project directory
cd backend/scripts
cp config.sh.dist config.sh
nano config.sh # replace DIRECTORY_ID by the schoolxDirectoryId you stored and save
```

### Configurer crontab

```bash
crontab -e # add add the end of the file the following line and adapt the path and the frequency:
# 0 14,22 * * * bash ~/schoolx/backend/scripts/backup.sh
```


