FROM node:24-alpine

WORKDIR /app

COPY package*.json /app/
COPY node_modules /app/node_modules/
COPY dist /app/dist/
COPY static /app/static/

EXPOSE 4090
CMD ["npm", "run", "start"]
