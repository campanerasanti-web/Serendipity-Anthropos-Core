#!/bin/bash

# El Mediador de Sofía - Backend Startup Script
# For Linux/Mac/WSL users

echo "🚀 Starting El Mediador de Sofía Backend..."
echo ""

# Check if .NET is installed
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK not found!"
    echo "📥 Installing .NET SDK..."
    
    # For Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y dotnet-sdk-7.0
    # For Fedora/RHEL
    elif command -v dnf &> /dev/null; then
        sudo dnf install dotnet-sdk-7.0
    # For macOS
    elif command -v brew &> /dev/null; then
        brew install dotnet-sdk
    else
        echo "⚠️  Please install .NET SDK manually from https://dotnet.microsoft.com/download"
        exit 1
    fi
fi

echo "✅ .NET SDK found: $(dotnet --version)"
echo ""

# Navigate to backend directory
cd backend || { echo "❌ backend directory not found"; exit 1; }

echo "📦 Restoring dependencies..."
dotnet restore

echo ""
echo "🏗️  Building project..."
dotnet build

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "🌍 Starting backend server on http://localhost:5000"
echo ""
echo "💡 Press Ctrl+C to stop the server"
echo ""

# Run backend
dotnet run

