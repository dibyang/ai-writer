$ErrorActionPreference = 'Stop'
$base = 'D:\work\other\ai-writer\acceptance\20261101-release-0100-publish'
$assets = 'D:\work\other\ai-writer\acceptance\20261101-release-0100-merged\candidate'
$commit = 'b7847b8ee736306e8d2fe36bf4540f92e4809307'
$sha = '8c9f9fdc7a675d65876156cb4d01dd8b5d93e1b63644d5d31e6a1a644bbd7eba'
if ((Get-FileHash -Algorithm SHA256 -LiteralPath "$assets\ai-writer-0.10.0.zip").Hash.ToLowerInvariant() -ne $sha) { throw 'Local ZIP hash mismatch' }
$lines = @('protocol=https','host=github.com','','') | git credential fill
if ($LASTEXITCODE -ne 0) { throw 'Git credential unavailable' }
$entry = $lines | Where-Object { $_ -like 'password=*' } | Select-Object -First 1
if (-not $entry) { throw 'Git credential has no password' }
$token = $entry.Substring(9)
$headers = @{ Authorization = "Bearer $token"; Accept = 'application/vnd.github+json'; 'X-GitHub-Api-Version' = '2022-11-28'; 'User-Agent' = 'ai-writer-release' }
$api = 'https://api.github.com/repos/dibyang/ai-writer'
$body = @{ tag_name='v0.10.0'; target_commitish=$commit; name='ai-writer 0.10.0'; body=(Get-Content -Raw -Encoding utf8 -LiteralPath "$assets\RELEASE_NOTES.md"); draft=$true; prerelease=$false } | ConvertTo-Json -Depth 5
$release = Invoke-RestMethod -Method Post -Uri "$api/releases" -Headers $headers -ContentType 'application/json; charset=utf-8' -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
@{id=$release.id;html_url=$release.html_url;tag_name=$release.tag_name;draft=$release.draft} | ConvertTo-Json | Set-Content -Encoding utf8 "$base\draft-release.json"
$upload = $release.upload_url.Split('{')[0]
$uploaded = @()
foreach ($name in @('ai-writer-0.10.0.zip','SHA256SUMS.txt','release-manifest.json','RELEASE_NOTES.md')) {
  $file = Join-Path $assets $name
  $item = Invoke-RestMethod -Method Post -Uri ($upload+'?name='+[uri]::EscapeDataString($name)) -Headers $headers -ContentType 'application/octet-stream' -InFile $file
  $expected = (Get-FileHash -Algorithm SHA256 -LiteralPath $file).Hash.ToLowerInvariant()
  $download = Join-Path $base ('verified-'+$name)
  $binaryHeaders = @{ Authorization = "Bearer $token"; Accept='application/octet-stream'; 'X-GitHub-Api-Version'='2022-11-28'; 'User-Agent'='ai-writer-release' }
  Invoke-WebRequest -Uri $item.url -Headers $binaryHeaders -OutFile $download
  $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $download).Hash.ToLowerInvariant()
  $uploaded += @{name=$name;id=$item.id;expected=$expected;actual=$actual;ok=($expected -eq $actual)}
  $uploaded | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 "$base\asset-verification.json"
  if ($expected -ne $actual) { throw "Downloaded asset hash mismatch: $name; draft retained" }
}
$final = Invoke-RestMethod -Method Patch -Uri "$api/releases/$($release.id)" -Headers $headers -ContentType 'application/json' -Body '{"draft":false,"prerelease":false}'
@{id=$final.id;html_url=$final.html_url;tag_name=$final.tag_name;draft=$final.draft;prerelease=$final.prerelease;published_at=$final.published_at} | ConvertTo-Json | Set-Content -Encoding utf8 "$base\published-release.json"
if ($final.draft -or $final.prerelease -or $final.tag_name -ne 'v0.10.0') { throw 'Unexpected final release state' }
Write-Output "Published: $($final.html_url)"
