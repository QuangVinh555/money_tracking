FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy toàn bộ source code
COPY server/src/ ./server/src/

# Debug: Liệt kê file trong thư mục dự án
RUN echo "DEBUG: Listing src/Services/API" && ls -la ./src/Services/API

# Restore, build, publish dựa trên đúng đường dẫn vật lý
RUN dotnet restore ./server/src/Services/API/server.csproj
RUN dotnet build ./server/src/Services/API/server.csproj -f net8.0
RUN dotnet publish -c Release -o out ./server/src/Services/API/server.csproj --no-restore -f net8.0

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
EXPOSE 80
ENTRYPOINT ["dotnet", "server.dll"]