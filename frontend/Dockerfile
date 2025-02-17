# 使用官方的 Node.js 20.11.1 作为基础镜像
FROM node:20.11.1 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 构建应用
RUN npm run build

# 使用 nginx 作为基础镜像
FROM nginx:alpine

# 删除默认的 Nginx 网站配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制构建后的文件到 nginx 的 html 目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
