# 使用官方的 .NET 8 SDK 镜像作为基础镜像
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# 设置工作目录
WORKDIR /app

# 复制项目文件到工作目录
COPY . .

# 恢复依赖
RUN dotnet restore

# 构建项目
RUN dotnet publish -c Release -o out

# 使用 .NET 运行时镜像作为基础镜像
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# 设置工作目录
WORKDIR /app

# 复制构建文件到运行时镜像
COPY --from=build /app/out .

# 设置 ASPNETCORE_URLS 环境变量以确保监听端口 80
ENV ASPNETCORE_URLS=http://+:80

# 暴露端口
EXPOSE 80

# 运行应用
ENTRYPOINT ["dotnet", "JosephBlog.dll"]