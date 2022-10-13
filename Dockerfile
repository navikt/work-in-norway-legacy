FROM node:18-alpine

# Create app directory
WORKDIR /app

# Set permission/ownership needed for build output
# (1069 is the uid for the app process in containers on nais)
RUN chown -R 1069 /app

# Installing dependencies
COPY package*.json /app/
RUN npm ci

# Copy app source
COPY src /app/src/
COPY tsconfig.json /app/

# Start app
EXPOSE 4090
CMD ["npm", "run", "start-docker"]
