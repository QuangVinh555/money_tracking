FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy toàn bộ source code
COPY src/ ./src/

# Restore, build, publish dựa trên đúng đường dẫn vật lý
RUN dotnet restore ./src/Services/API/server.csproj
RUN dotnet build ./src/Services/API/server.csproj -f net8.0
RUN dotnet publish -c Release -o out ./src/Services/API/server.csproj --no-restore -f net8.0
RUN echo "Contents of out directory:" && ls -la out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
RUN echo "Contents of /app directory:" && ls -la
EXPOSE 80
ENTRYPOINT ["dotnet", "server.dll"]
