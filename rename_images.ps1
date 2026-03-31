Set-Location 'C:\Users\rekaj\Desktop\rekarajza\public\galeria'
$files = @('7.JPG','8.JPG','9.JPG','10.JPG','11.JPG','14.JPG','15.JPG','19.JPG','20.JPG','21.JPG','2.jpeg','3.jpeg')
foreach ($f in $files) {
  $base = [System.IO.Path]::GetFileNameWithoutExtension($f)
  $ext = [System.IO.Path]::GetExtension($f).ToLower()
  if (Test-Path $f) {
    Rename-Item $f "${base}_tmp${ext}"
    Rename-Item "${base}_tmp${ext}" "${base}${ext}"
  }
}
Get-ChildItem | Select-Object Name
