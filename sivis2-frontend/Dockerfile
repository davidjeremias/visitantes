FROM node:9.11.1-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache git

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:1.13.12-alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# EXCLUI A CONFIGURAÇÃO PADRÃO DO NGINX 
RUN rm -rf /etc/nginx/conf.d/default.conf

# COPIA UMA NOVA CONFIGURAÇÃO PARA O FUNCIONAMENTO CORRETO DO VUE-ROUTER
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["sh", "-c", "nginx -g 'daemon off;'"]