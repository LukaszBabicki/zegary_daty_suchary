# Etap 1: Development
FROM alpine AS development

# Instalowanie git
RUN apk add --no-cache git

# Ustawienie katalogu roboczego
WORKDIR /app

# Klonowanie repo
RUN git clone https://github.com/LukaszBabicki/zegary_daty_suchary.git

# Etap 2: Builder
FROM alpine AS builder

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie plików z etapu development
COPY --from=development /app/zegary_daty_suchary /app

# Etap 3: Production Environment
FROM nginx:alpine

# Usunięcie domyślnych plików konfiguracji Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Kopiowanie nowej konfiguracji Nginx
COPY nginx.conf /etc/nginx/conf.d

# Kopiowanie plików aplikacji z etapu builder
COPY --from=builder /app /usr/share/nginx/html

# Tworzenie wymaganych katalogów i nadawanie uprawnień
RUN mkdir -p /var/cache/nginx/client_temp \
    && chown -R nginx:nginx /var/cache/nginx \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

# Zmiana właściciela i uprawnień plików na użytkownika nginx
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Zmiana użytkownika na non-root (nginx)
USER nginx

# Otwarcie portu 80
EXPOSE 80

# Uruchomienie Nginx
CMD ["nginx", "-g", "daemon off;"]
