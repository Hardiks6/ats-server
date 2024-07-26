FROM node:20

ARG WORK_DIR=/backend
ENV PATH ${WORK_DIR}/node_modules/.bin:$PATH

RUN mkdir ${WORK_DIR}
WORKDIR ${WORK_DIR}

COPY package.json ${WORK_DIR}
COPY package-lock.json ${WORK_DIR}

RUN npm install
RUN npm install -g sequelize-cli

COPY . ${WORK_DIR}

EXPOSE 5000

CMD npm start --host 0.0.0.0