$Project = Split-Path -Parent $PSScriptRoot
$Watcher = Join-Path $Project 'tools/sync-to-github.ps1'
Start-Process powershell.exe -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File',"`"$Watcher`"" -WorkingDirectory $Project
Write-Host 'GitHub auto-sync started in a separate PowerShell window.'
