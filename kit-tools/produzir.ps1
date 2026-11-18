# Produção de um vídeo personalizado em poucos comandos (base Remotion).
# Uso (na raiz do repositório):
#   .\kit-tools\produzir.ps1 -Etapa contar            conta palavras de voz\cenaN.txt
#   .\kit-tools\produzir.ps1 -Etapa ancoras           confere lead.ts x narração e gera sfx/legendas (tools\orcamento.mjs)
#   .\kit-tools\produzir.ps1 -Etapa legendas          gera legendas a partir de narr\timeline.json (kit-tools\subs.py)
#   .\kit-tools\produzir.ps1 -Etapa tipos             checagem de tipos (tsc)
#   .\kit-tools\produzir.ps1 -Etapa quadros [-Tempos 3.5,8.2]   quadros-chave via stills.mjs
#   .\kit-tools\produzir.ps1 -Etapa render            renderiza out\muted.mp4 (sem áudio)
#
# A VOZ não faz parte deste repositório: gere voz\cenaN.mp3 com o provedor de TTS que você usa e monte
# narr\timeline.json (palavras com start/end) e video\public\narracao.wav. Nenhuma chave de API é usada aqui.
param(
  [Parameter(Mandatory = $true)][ValidateSet('contar', 'ancoras', 'legendas', 'tipos', 'quadros', 'render')][string]$Etapa,
  [double[]]$Tempos = @(2, 6, 10, 14, 18),
  [string]$Composicao = 'Exemplo',
  [string]$Python = 'python'
)
[Console]::OutputEncoding = [Text.Encoding]::UTF8; $env:PYTHONIOENCODING = 'utf-8'
$root = Split-Path -Parent $PSScriptRoot   # raiz do repositório (a pasta acima de kit-tools)
$video = Join-Path $root 'video'
$voz = Join-Path $root 'voz'
$kit = Join-Path $root 'kit-tools'

function Contar-Palavras {
  $tot = 0
  foreach ($n in 1..10) {
    $f = Join-Path $voz "cena$n.txt"
    if (Test-Path $f) {
      $t = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)
      $w = ($t -split '\s+' | Where-Object { $_ }).Count
      $tot += $w
      "cena$n : $w palavras"
    }
  }
  "TOTAL: $tot palavras"
}

switch ($Etapa) {
  'contar'   { Contar-Palavras }
  'ancoras'  { Push-Location $root; node tools/orcamento.mjs; Pop-Location }
  'legendas' {
    $tl = Join-Path $root 'narr\timeline.json'
    if (-not (Test-Path $tl)) { throw "não achei $tl (monte a timeline de palavras da narração antes)" }
    & $Python -I "$kit\subs.py" $tl "$video\src\data\subtitles.json"
  }
  'tipos'    { Push-Location $video; npx tsc --noEmit -p .; Pop-Location }
  'quadros'  {
    $out = Join-Path $root 'out\quadros'
    New-Item -ItemType Directory -Force $out | Out-Null
    Push-Location $video
    $args2 = @($out) + @($Tempos | ForEach-Object { $_.ToString([Globalization.CultureInfo]::InvariantCulture) })
    node stills.mjs @args2
    Pop-Location
    "quadros em $out"
  }
  'render'   {
    New-Item -ItemType Directory -Force (Join-Path $root 'out') | Out-Null
    Push-Location $video
    npx remotion render src/index.ts $Composicao (Join-Path $root 'out\muted.mp4') --codec h264 --crf 18 --muted
    Pop-Location
    "vídeo sem áudio: $(Join-Path $root 'out\muted.mp4')"
  }
}
