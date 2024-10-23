# Specify the path to the directory
$directoryPath = "C:\Users\User\Desktop\uploadSuccess"

# Specify the name of the file to be created
$fileName = "usuarios.txt"

# Combine the directory path and file name into the full file path
$fullFilePAth = Join-Path -Path $directoryPath -ChildPath $fileName

# Check if the file already exists at the full file path
if (!(Test-Path -Path $fullFilePAth)) {
    # If the file does not exist, create it
    New-Item -ItemType File -Path $fullFilePAth
}

# Función para generar un usuario aleatorio
function Generate-RandomUsername {
    $random = -join ((97..122) + (48..57) | Get-Random -Count 4 | % { [char]$_ })
    return "amatlan-$random"
}

# Función para generar una contraseña según el patrón dado
function Generate-Password {
    param (
        [int]$Length = 20
    )

    if ($Length -lt 20 -or $Length -gt 100) {
        throw "La longitud de la contraseña debe estar entre 20 y 100 caracteres."
    }

    $lowerCaseLetters = [char[]](32..126) -match '[a-z]'
    $upperCaseLetters = [char[]](32..126) -match '[A-Z]'
    $digits = [char[]](48..57)

    $password = @()

    # Asegurar al menos un carácter de cada grupo
    $password += $lowerCaseLetters | Get-Random
    $password += $upperCaseLetters | Get-Random
    $password += $digits | Get-Random

    # Rellenar el resto de la contraseña con caracteres aleatorios
    while ($password.Length -lt $Length) {
        $password += $lowerCaseLetters + $upperCaseLetters + $digits | Get-Random
    }

    # Mezclar la contraseña para asegurar la aleatoriedad
    $password = $password -join ''
    $password = $password.ToCharArray()
    for ($i = $password.Length - 1; $i -gt 0; $i--) {
        $j = Get-Random -Minimum 0 -Maximum $i
        $temp = $password[$i]
        $password[$i] = $password[$j]
        $password[$j] = $temp
    }

    $password -join ''
}

# Ruta servidor
$Uri = 'https://api.black-ops.pro/api/v1/auth/register'



# Número de veces que se ejecutará el script
$iterations = 5

for ($i = 1; $i -le $iterations; $i++) {
    $username = Generate-RandomUsername
    $password = Generate-Password

    # Comprobación de que el usuario no exista previamente
    if (Select-String -Path $fullFilePAth -Pattern $username) {
        Write-Host "Iteración $i El usuario '$username' ya existe. Intentando con otro..."
    } else {
        $Body = @{
            "username" = "$username"
            "password" = "$password"
        }

        $response = Invoke-RestMethod -Uri $Uri -Method Post -Body ($Body | ConvertTo-Json) -ContentType "application/json" 

       # Verificar si la respuesta es exitosa
        if ($response.success) {
            # Agregar el usuario y contraseña al archivo de salida
            "$username $password" | Out-File -FilePath $fullFilePath -Append -Force
            Write-Host "Iteración $i Usuario '$username' creado."
        } else {
            Write-Host "Iteración $i Error al crear el usuario '$username'. Código de estado: $($response.message)"
        }
    }
}