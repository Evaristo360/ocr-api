

Write-Host "Inicia: Proceso de carga de archivos....."
Write-Host "Puede tomar unos minutos, no cierre la ventana."

$Uri = 'https://api.host/api/v1/files/upload'
$files = Get-ChildItem -Path 'C:\filesPDF' -Filter *.pdf

foreach ($file in $files) {

    	$Form = @{
    	file     = Get-Item -Path $file.FullName
	}
	$response = Invoke-RestMethod -Uri $Uri -Method Post -Form $Form

    if ($response) {
        Write-Host "File $($file.Name) uploaded. Response: $($response)"

        if ($response -eq "Failed") {
            # No hacer nada
    	} elseif ($response -eq "Deleted") {
            Move-Item -Path $file.FullName -Destination "C:\filesPDF_fail"
        } elseif ($response -eq "Success") {
            Move-Item -Path $file.FullName -Destination "C:\filesPDF_backup"
        }
    } else {
        Write-Host "File $($file.Name) failed to upload."
    }
}