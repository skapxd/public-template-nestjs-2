# Define el nombre del programa
$programname = $MyInvocation.MyCommand.Name

function Display-Usage {
    Write-Host "usage: $programname (create|restore) source destination"
    Write-Host "  create         create snapshot file from docker volume"
    Write-Host "  restore        restore snapshot file to docker volume"
    Write-Host "  source         source path"
    Write-Host "  destination    destination path"
    Write-Host ""
    Write-Host "Tip: Supports tar's compression algorithms automatically"
    Write-Host "     based on the file extension, for example .tar.gz"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "docker-volume-snapshot create xyz_volume xyz_volume.tar"
    Write-Host "docker-volume-snapshot create xyz_volume xyz_volume.tar.gz"
    Write-Host "docker-volume-snapshot restore xyz_volume.tar xyz_volume"
    Write-Host "docker-volume-snapshot restore xyz_volume.tar.gz xyz_volume"
}

# Verifica si se han proporcionado los argumentos necesarios
if ($args.Count -lt 3) {
    Display-Usage
    exit 1
}

$command = $args[0]
$source = $args[1]
$destination = $args[2]

switch ($command) {
    "create" {
        $directory = Split-Path -Path $destination -Parent
        if ($directory -eq ".") { $directory = Get-Location }
        $filename = Split-Path -Path $destination -Leaf
        
        # Check if $directory is empty and set it to the current directory if it is
        if ([string]::IsNullOrEmpty($directory)) {
            $directory = Get-Location
        }
        
        # Ejecuta un contenedor Docker temporal para crear el archivo tar
        docker run --rm -v "$($source):/source" -v "$($directory):/dest" busybox tar cvaf "/dest/$($filename)" -C /source .
    }
    "restore" {
        # La lógica para el comando restore iría aquí
        if (-not $args[1] -or -not $args[2]) {
            Display-Usage
            exit 1
        }
        $directory = Split-Path -Path $args[1] -Parent
        if ($directory -eq ".") {
            $directory = Get-Location
        }
        $filename = Split-Path -Path $args[1] -Leaf
        docker run --rm -v "$($args[2]):/dest" -v "$($directory):/source" busybox tar xvf "/source/$filename" -C /dest
    }
    default {
        Display-Usage
        exit 1
    }
}