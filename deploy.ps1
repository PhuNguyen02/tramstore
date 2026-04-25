$ip = "103.69.96.183"
$user = "root"
$pass = "pTtOLLtsX2WYXCbw"

# Script to run on VPS
$remoteScript = @"
apt-get update
apt-get install -y docker.io docker-compose git
if [ -d "tramstore" ]; then
  cd tramstore && git pull
else
  git clone https://github.com/PhuNguyen02/tramstore.git
  cd tramstore
fi
docker-compose build
docker-compose up -d
"@

# This is a hacky way to try and send password to ssh on Windows
$sshProcess = New-Object System.Diagnostics.Process
$sshProcess.StartInfo.FileName = "ssh"
$sshProcess.StartInfo.Arguments = "-o StrictHostKeyChecking=no $user@$ip `"$remoteScript`""
$sshProcess.StartInfo.UseShellExecute = $false
$sshProcess.StartInfo.RedirectStandardInput = $true
$sshProcess.StartInfo.RedirectStandardOutput = $true
$sshProcess.StartInfo.RedirectStandardError = $true
$sshProcess.Start()

Start-Sleep -Seconds 2
$sshProcess.StandardInput.WriteLine($pass)
$sshProcess.StandardInput.Flush()

$output = $sshProcess.StandardOutput.ReadToEnd()
$error = $sshProcess.StandardError.ReadToEnd()
$sshProcess.WaitForExit()

Write-Output "Output: $output"
Write-Output "Error: $error"
