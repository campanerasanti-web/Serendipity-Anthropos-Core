# Script: Actualiza Firewall SSH a tu IP actual (Google Cloud)
# Guarda este archivo como update-ssh-firewall.ps1 y ejecútalo con PowerShell

# CONFIGURA TU PROYECTO Y REGLA
$firewallRule = "permitir-ssh-admin"   # Nombre de la regla de firewall
$project = "TU_ID_DE_PROYECTO"         # Cambia por tu ID de proyecto

# OBTIENE TU IP PÚBLICA
$myIp = (Invoke-RestMethod -Uri "https://api.ipify.org?format=text")

# ACTUALIZA LA REGLA DE FIREWALL
Write-Host "Actualizando regla $firewallRule para permitir SSH solo desde $myIp..."
gcloud compute firewall-rules update $firewallRule `
  --source-ranges="$myIp/32" `
  --project=$project `
  --allow=tcp:22

Write-Host "✅ Firewall actualizado. SSH solo permitido desde $myIp"
