# PowerShell script to batch fix page_title translations
$files = @{
    "wfc.html" = "Wells Fargo (WFC)"
    "tjx.html" = "The TJX Companies (TJX)"
    "sbux.html" = "Starbucks Corporation (SBUX)"
    "panw.html" = "Palo Alto Networks (PANW)"
    "lin.html" = "Linde plc (LIN)"
    "lilly.html" = "Eli Lilly (LLY)"
    "hon.html" = "Honeywell International (HON)"
    "hd.html" = "The Home Depot (HD)"
    "gs.html" = "Goldman Sachs (GS)"
    "gev.html" = "GE Vernova (GEV)"
    "etn.html" = "Eaton Corporation (ETN)"
    "dis.html" = "The Walt Disney Company (DIS)"
    "dhr.html" = "Danaher Corporation (DHR)"
    "dd.html" = "DuPont de Nemours (DD)"
    "csco.html" = "Cisco Systems (CSCO)"
    "crwd.html" = "CrowdStrike (CRWD)"
    "crm.html" = "Salesforce (CRM)"
    "cof.html" = "Capital One Financial (COF)"
    "bmy.html" = "Bristol Myers Squibb (BMY)"
    "blk.html" = "BlackRock (BLK)"
    "avgo.html" = "Broadcom (AVGO)"
    "abt.html" = "Abbott Laboratories (ABT)"
}

foreach ($file in $files.Keys) {
    $companyName = $files[$file]
    $ticker = ($companyName -split '\(' | Select-Object -Last 1).Replace(')', '')
    Write-Host "File: $file -> Company: $companyName"
}