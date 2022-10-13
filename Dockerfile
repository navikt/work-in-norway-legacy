FROM node:18-alpine

WORKDIR /app

COPY package*.json /app/
COPY node_modules /app/node_modules/
COPY distSrc /app/distSrc/
COPY static /app/static/

# Start app
EXPOSE 4090
CMD ["npm", "run", "start"]
