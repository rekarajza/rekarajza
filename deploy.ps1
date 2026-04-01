param(
    [string]$message = "update"
)

git add -A
git commit -m $message
git push

Write-Host ""
Write-Host "Kész! Vercel-en hamarosan megjelenik a változás." -ForegroundColor Green
