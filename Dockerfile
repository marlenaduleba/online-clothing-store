# Użyj obrazu node jako bazowy
FROM node:18

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj pliki package.json i package-lock.json do katalogu roboczego
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj resztę plików aplikacji do katalogu roboczego
COPY . .

# Skompiluj TypeScript do JavaScript
RUN npm run build

# Ustaw zmienną środowiskową
ENV NODE_ENV=production

# Expose port aplikacji
EXPOSE 3000

# Uruchom aplikację
CMD ["node", "dist/server.js"]
