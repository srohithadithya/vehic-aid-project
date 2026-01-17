
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   GitHub Auth Fixer (Simple Version)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please follow the instructions below exactly."
Write-Host "1. Copy your Personal Access Token."
Write-Host "2. Paste it below (Right-click in terminal works best)."
Write-Host "3. Press Enter."
Write-Host ""

# Use plain Read-Host so you can SEE what you paste. 
# This helps avoid invisible errors.
$token = Read-Host "Paste Token Here" 

if (-not $token) {
    Write-Host "❌ No token input received." -ForegroundColor Red
    exit 1
}

# Aggressive cleaning of the input
# Remove spaces, tabs, newlines, carriage returns
$token = $token.Trim()
$token = $token -replace "\s", "" # regex replace all whitespace

if ($token.Length -lt 10) { 
    Write-Host "❌ Token looks too short ($($token.Length) chars). Please check it." -ForegroundColor Red
    exit 1 
}

Write-Host "Token accepted (Length: $($token.Length)). Configuring git..."

# Reset first to standard URL to clear any bad configs
git remote set-url origin "https://github.com/srohithadithya/vehic-aid-project.git"

# CRITICAL FIX: Disable Windows Credential Manager for this repo
# This prevents it from overriding your PAT with an old password
Write-Host "Disabling credential manager for this repo to prevent conflicts..."
git config --local --unset credential.helper
git config --local credential.helper "" 

# Construct URL (The PAT acts as the username)
$repoUrl = "https://$($token)@github.com/srohithadithya/vehic-aid-project.git"

# Apply
git remote set-url origin $repoUrl

# Verify
try {
    Write-Host "Testing connection..."
    git fetch origin
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SUCCESS! Authentication fixed." -ForegroundColor Green
    }
    else {
        throw "Fetch failed"
    }
}
catch {
    Write-Host "❌ Still failing. Please check:" -ForegroundColor Red
    Write-Host "   1. Does the token have 'repo' and 'workflow' boxes checked?"
    Write-Host "   2. Did you copy the whole string starting with ghp_?"
}
