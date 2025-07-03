# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy entire server folder
COPY server ./server

# Restore
RUN dotnet restore server/src/Services/API/server.csproj

# Build
RUN dotnet build server/src/Services/API/server.csproj -c Release -o /app/build

# Publish
RUN dotnet publish server/src/Services/API/server.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expose port
EXPOSE 80
ENTRYPOINT ["dotnet", "server.dll"]
