# Stage 1 - Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el csproj y restaurar dependencias (mejor cache)
COPY ["ElMediadorDeSofia.csproj", "./"]
RUN dotnet restore "ElMediadorDeSofia.csproj"

# Copiar todo el código y publicar
COPY . .
RUN dotnet publish "ElMediadorDeSofia.csproj" -c Release -o /app/publish

# Stage 2 - Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_HTTP_PORTS=8080
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "ElMediadorDeSofia.dll"]
