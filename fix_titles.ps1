# PowerShell script to fix remaining page titles
$basePath = "C:\Users\TS2\Desktop\market-analysis-AI\stocks\details"

# Define company name mappings
$companies = @{
    "abt.html" = @("Abbott Laboratories (ABT)", "ABT")
    "avgo.html" = @("Broadcom (AVGO)", "AVGO") 
    "blk.html" = @("BlackRock (BLK)", "BLK")
    "bmy.html" = @("Bristol Myers Squibb (BMY)", "BMY")
    "cof.html" = @("Capital One Financial (COF)", "COF")
    "crm.html" = @("Salesforce (CRM)", "CRM")
    "crwd.html" = @("CrowdStrike (CRWD)", "CRWD")
    "csco.html" = @("Cisco Systems (CSCO)", "CSCO")
    "dd.html" = @("DuPont de Nemours (DD)", "DD")
    "dhr.html" = @("Danaher Corporation (DHR)", "DHR")
}

foreach ($file in $companies.Keys) {
    $filePath = Join-Path $basePath $file
    $companyName = $companies[$file][0]
    $ticker = $companies[$file][1]
    
    if (Test-Path $filePath) {
        Write-Host "Processing: $file -> $companyName"
        
        # Read file content
        $content = Get-Content $filePath -Raw
        
        # Replace page_title with correct format
        $newJaTitle = "$companyName | YOHOU米国株AI予報"
        $newEnTitle = "$companyName | YOHOU US Stock AI Forecast"
        
        # Pattern to find and replace
        $pattern = 'page_title:\s*\{\s*ja:\s*[\'""]【[^}]+[\'""],\s*en:\s*[\'""][^}]+[\'""]\s*\}'
        $replacement = "page_title: { ja: '$newJaTitle', en: '$newEnTitle' }"
        
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $replacement
            Set-Content -Path $filePath -Value $content -Encoding UTF8
            Write-Host "Updated: $file"
        } else {
            Write-Host "Pattern not found in: $file"
        }
    }
}