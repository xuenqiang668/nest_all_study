FROM node:18-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18-alpine3.14 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]

# FROM 后面添加一个 as 来指定当前构建阶段的名字。

# 通过 COPY --from=xxx 可以从上个阶段复制文件过来。

# 然后 npm install 的时候添加 --production，这样只会安装 dependencies 的依赖。

# docker build 之后，只会留下最后一个阶段的镜像。

# 也就是说，最终构建出来的镜像里是没有源码的，有的只是 dist 的文件和运行时依赖。

# 这样镜像就会小很多。

# docker build -t dockerfile-test:third -f 222.Dockerfile .
