FROM node:12 

WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY  dist ./dist
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
