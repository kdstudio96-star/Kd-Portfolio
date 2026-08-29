$ErrorActionPreference = 'Stop'
$Project = Split-Path -Parent $PSScriptRoot
$GitDir = Join-Path (Split-Path -Parent $Project) 'kd-portfolio-upload-git'
$WorkTree = $Project

Set-Location $Project
Write-Host "Kd Portfolio sync watcher is running. Press Ctrl+C to stop."

while ($true) {
  try {
    $changes = git --git-dir=$GitDir --work-tree=$WorkTree status --porcelain
    if ($changes) {
      git --git-dir=$GitDir --work-tree=$WorkTree add -A
      $stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
      git --git-dir=$GitDir --work-tree=$WorkTree commit -m "Auto-save portfolio $stamp" | Out-Null
      git --git-dir=$GitDir --work-tree=$WorkTree push origin main | Out-Host
      Write-Host "[$stamp] Saved locally and pushed to GitHub."
    }
  } catch {
    Write-Warning "Sync paused: $($_.Exception.Message)"
  }
  Start-Sleep -Seconds 30
}
