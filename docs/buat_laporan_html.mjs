import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(new URL('./Laporan_Evaluasi_KemanaYa.md', import.meta.url), 'utf8');
const output = new URL('./Laporan_Evaluasi_KemanaYa.html', import.meta.url);
const esc = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const inline = value => value.split(/(`[^`]+`)/g).map(part => part.startsWith('`') ? `<code>${esc(part.slice(1, -1))}</code>` : esc(part).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')).join('');
const contents = [...source.matchAll(/^## (\d+) (.+)$/gm)].map(([, number, title]) => ({ number, title, id: `bab-${number}` }));
const labels = [
  'Klasifikasi bukti evaluasi', 'Daftar sumber dan kegunaan', 'Status implementasi fitur',
  'Teknologi frontend', 'Teknologi backend', 'Peta file dan tanggung jawab',
  'Komponen antarmuka yang digunakan kembali', 'Kamus data akun pengguna',
  'Kamus data tempat', 'Kamus data rating', 'Daftar endpoint REST API',
  'Kode status respons API', 'Contoh perhitungan rating dan rekomendasi',
  'Aturan profil dan kontribusi', 'Evaluasi kontrol keamanan',
  'Penilaian kualitas dokumentasi', 'Hasil pemeriksaan yang dijalankan',
  'Matriks skenario pengujian tambahan', 'Variabel konfigurasi aplikasi',
  'Pemisahan lingkungan aplikasi', 'Panduan penanganan kendala',
  'Register temuan dan kriteria penyelesaian', 'Daftar bukti dokumentasi', 'Glosarium istilah teknis',
];
const lines = source.split(/\r?\n/);
const blocks = [];
let paragraph = [], tableIndex = 0, sectionOpen = false, ordered = false, skipContents = false, started = false;
const flush = () => { if (paragraph.length) { blocks.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; } };
const closeList = () => { if (ordered) { blocks.push('</ol>'); ordered = false; } };
const closeSection = () => { if (sectionOpen) { blocks.push('</section>'); sectionOpen = false; } };
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!started) { if (line === '## Ringkasan eksekutif') started = true; else continue; }
  if (line === '## Daftar isi') { flush(); closeList(); closeSection(); skipContents = true; continue; }
  if (skipContents && !/^## \d+ /.test(line)) continue;
  if (skipContents) skipContents = false;
  if (line.startsWith('```')) {
    flush(); closeList();
    const code = [], language = line.slice(3).trim();
    while (++i < lines.length && !lines[i].startsWith('```')) code.push(lines[i]);
    blocks.push(`<pre aria-label="Contoh ${esc(language || 'alur')}"><code>${esc(code.join('\n'))}</code></pre>`);
  } else if (/^## /.test(line)) {
    flush(); closeList(); closeSection();
    const title = line.slice(3), chapter = /^(\d+) (.+)$/.exec(title);
    const id = chapter ? `bab-${chapter[1]}` : 'ringkasan';
    blocks.push(`<section class="${chapter ? 'chapter' : 'executive'}" aria-labelledby="${id}"><h2 id="${id}">${chapter ? `<span class="chapter-number">${chapter[1].padStart(2, '0')}</span> ${esc(chapter[2])}` : esc(title)}</h2>`);
    sectionOpen = true;
  } else if (/^### /.test(line)) {
    flush(); closeList();
    const title = line.slice(4), number = /^(\d+\.\d+) /.exec(title)?.[1];
    blocks.push(`<h3${number ? ` id="sub-${number.replace('.', '-')}"` : ''}>${inline(title)}</h3>`);
  } else if (line.startsWith('|')) {
    flush(); closeList();
    const rows = [line];
    while (i + 1 < lines.length && lines[i + 1].startsWith('|')) rows.push(lines[++i]);
    const cells = row => row.replace(/^\|\s*|\s*\|$/g, '').split('|').map(cell => cell.trim());
    const head = cells(rows[0]), data = rows.slice(2).map(cells);
    if (data.some(row => row.length !== head.length)) throw new Error(`Kolom tidak sesuai pada tabel ${tableIndex + 1}`);
    const label = labels[tableIndex++];
    if (!label) throw new Error('Judul tabel belum tersedia');
    const weights = head.map((title, index) => Math.sqrt(Math.max(title.length, ...data.map(row => row[index].replaceAll('`', '').length)))) ;
    const total = weights.reduce((a, b) => a + b, 0);
    const cols = weights.map(weight => `<col style="width:${(weight / total * 100).toFixed(2)}%">`).join('');
    blocks.push(`<div class="table-scroll" tabindex="0" role="region" aria-label="Tabel ${tableIndex} ${esc(label)}"><table id="tabel-${tableIndex}"><caption><span>Tabel ${tableIndex}</span> ${esc(label)}</caption><colgroup>${cols}</colgroup><thead><tr>${head.map(cell => `<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead><tbody>${data.map(row => `<tr>${row.map((cell, index) => `<td${index === 0 && /^(T\d+|U\d+|B\d+|S\d+|\d{3})$/.test(cell) ? ' class="identifier"' : ''}>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
  } else if (/^\d+\. /.test(line)) {
    flush(); if (!ordered) { blocks.push('<ol>'); ordered = true; }
    blocks.push(`<li>${inline(line.replace(/^\d+\. /, ''))}</li>`);
  } else if (!line.trim()) { flush(); closeList(); }
  else { closeList(); paragraph.push(line.trim()); }
}
flush(); closeList(); closeSection();
const summaryEnd = blocks.findIndex((block, index) => block === '</section>' && index > 0);
const executive = blocks.splice(0, summaryEnd + 1).join('\n');
const css = `
:root{font-family:Cambria,Georgia,serif;color:#26323d;background:#e9edf1;font-size:17px;line-height:1.72;--sans:Segoe UI,Arial,sans-serif;--muted:#5d6872;--blue:#244662}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:85px}body{margin:0}a{color:var(--blue)}a:focus-visible,button:focus-visible,.table-scroll:focus-visible{outline:3px solid #476c92;outline-offset:4px}
.toolbar{position:sticky;top:0;z-index:10;background:#f8fafbf5;border-bottom:1px solid #d5dde4;font-family:var(--sans);font-size:.76rem}.toolbar-inner{max-width:1120px;margin:auto;padding:12px 30px;display:flex;align-items:center;justify-content:space-between;gap:20px}.toolbar-actions{display:flex;gap:22px;align-items:center}.toolbar a{text-decoration:none}.toolbar button{font:inherit;cursor:pointer;background:var(--blue);color:#fff;border:0;border-radius:4px;padding:9px 16px}
.document{max-width:1080px;margin:34px auto 48px;background:white;box-shadow:0 8px 40px #1d334314}.cover{min-height:800px;padding:82px 84px 60px;display:flex;flex-direction:column;justify-content:space-between}.eyebrow{font-family:var(--sans);font-size:.71rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin:0 0 42px}.cover h1{font-family:var(--sans);font-size:2.9rem;line-height:1.15;font-weight:650;letter-spacing:-.035em;color:#000;max-width:760px;margin:0 0 28px}.cover h1 span{display:block;margin-top:10px}.subtitle{max-width:560px;font-size:1.2rem;line-height:1.55;color:#4a5865}.cover-meta{display:grid;grid-template-columns:1fr 1fr;gap:24px 46px;margin:66px 0 44px;font-family:var(--sans);font-size:.83rem}.cover-meta div{min-width:0}.cover-meta dt{color:var(--muted);font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}.cover-meta dd{margin:0;font-weight:500}.cover-note{font-size:.86rem;max-width:650px;color:var(--muted)}
.frontmatter,.body-content{padding:0 84px}.frontmatter{padding-bottom:12px}.body-content{padding-bottom:65px}.executive{padding:38px 0 26px}.toc{padding:30px 0 48px}.toc ol{columns:2;column-gap:44px;padding:0;list-style:none}.toc li{break-inside:avoid;margin:0 0 12px;font-family:var(--sans);font-size:.78rem;line-height:1.5}.toc a{display:flex;gap:13px;text-decoration:none;color:#283b4b}.toc .toc-no{flex:0 0 22px;color:#758391;font-variant-numeric:tabular-nums}.toc a:hover{text-decoration:underline}.toc-intro{color:var(--muted);font-size:.9rem}
h2,h3{font-family:var(--sans);color:#000;line-height:1.35;break-after:avoid-page}h2{font-size:1.55rem;font-weight:650;letter-spacing:-.02em;margin:50px 0 24px}h3{font-size:1rem;font-weight:650;margin:29px 0 11px}.chapter-number{font-size:.76em;font-weight:500;margin-right:12px;color:#657584;font-variant-numeric:tabular-nums}.chapter{padding-top:6px}.chapter>h2{margin-top:45px}p{margin:0 0 17px}li{margin-bottom:7px}strong{font-weight:700}
code{font:0.79em Consolas,Cascadia Code,monospace;overflow-wrap:anywhere}p code,td code{background:#f0f3f6;padding:1px 4px;border-radius:2px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f5f7f9;border:1px solid #d9dfe5;padding:18px 20px;margin:20px 0 25px;line-height:1.55;break-inside:avoid-page}pre code{font-size:.72rem}
.table-scroll{margin:21px 0 29px;overflow-x:auto}table{border-collapse:collapse;table-layout:fixed;width:100%;font-family:var(--sans);font-size:.73rem;line-height:1.55}caption{text-align:left;caption-side:top;padding-bottom:11px;font-size:.74rem;font-weight:500;color:#222}caption span{font-weight:700;margin-right:9px}th,td{border:1px solid #d9d9d9;padding:11px 12px;vertical-align:middle;text-align:left;overflow-wrap:anywhere}th{background:#e6edf3;font-weight:650;color:#000}tbody tr:nth-child(even){background:#f7f9fb}thead{display:table-header-group}tr{break-inside:avoid-page}.identifier{font-weight:600;white-space:nowrap}td code{background:transparent;padding:0;font-size:.94em}
.document-footer{margin:0 84px;padding:24px 0 32px;font-family:var(--sans);font-size:.7rem;color:var(--muted);display:flex;justify-content:space-between;gap:20px}.skip-link{position:absolute;left:-10000px}.skip-link:focus{left:20px;top:15px;background:white;padding:10px;z-index:20}
@media(max-width:800px){:root{font-size:16px}.document{margin:0;box-shadow:none}.cover{padding:50px 28px;min-height:700px}.cover h1{font-size:2.45rem}.frontmatter,.body-content{padding-left:28px;padding-right:28px}.cover-meta{gap:24px}.toc ol{columns:1}.toolbar-inner{padding:10px 20px}.toolbar-label{display:none}.toolbar-actions{width:100%;justify-content:space-between}.document-footer{margin:0 28px}.table-scroll table{min-width:660px}h2{font-size:1.4rem}.eyebrow{margin-bottom:32px}}
@page{size:A4;margin:19mm 17mm 20mm;@bottom-left{content:"KemanaYa | Laporan Evaluasi Teknis";font-family:Arial,sans-serif;font-size:8pt;color:#5d6872}@bottom-right{content:"Halaman " counter(page);font-family:Arial,sans-serif;font-size:8pt;color:#5d6872}}
@page :first{@bottom-left{content:none}@bottom-right{content:none}}
@media print{:root{font-size:10.5pt;line-height:1.48;background:#fff;color:#222}html{scroll-behavior:auto}body{background:white}.toolbar,.skip-link{display:none}.document{width:auto;max-width:none;margin:0;box-shadow:none}.cover{padding:20mm 6mm 10mm;min-height:247mm;break-after:page}.cover h1{font-size:32pt;max-width:155mm}.eyebrow{font-size:8pt;margin-bottom:24mm}.subtitle{font-size:14pt;max-width:135mm}.cover-meta{font-size:10pt;gap:9mm 16mm;margin:22mm 0 15mm}.cover-meta dt{font-size:8pt}.cover-note{font-size:9.5pt}.frontmatter,.body-content{padding:0}.executive{padding:0;break-after:page}.executive h2{margin-top:0}.toc{padding:0;break-after:page}.toc h2{margin-top:0}.toc ol{columns:1;margin-top:6mm}.toc li{font-size:10pt;margin:0 0 2.3mm;line-height:1.4}.toc a{text-decoration:none;color:#222}.toc-intro{font-size:10pt}.chapter{padding:0}.chapter>h2{margin-top:9mm}h2{font-size:16pt;margin:9mm 0 5mm}h3{font-size:11pt;margin:6mm 0 3mm}p{margin-bottom:3.4mm;orphans:3;widows:3}.chapter-number{color:#444}a{color:#222;text-decoration:none}.table-scroll{overflow:visible;margin:4mm 0 6mm}.table-scroll table{min-width:0}table{font-size:8.1pt;line-height:1.42}caption{font-size:8.5pt;padding-bottom:2.5mm;break-after:avoid-page}th,td{padding:2.5mm 2.4mm}th{background:#e9eef2!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}tbody tr:nth-child(even){background:#f7f9fb!important;print-color-adjust:exact;-webkit-print-color-adjust:exact}pre{padding:3mm 4mm;margin:4mm 0;line-height:1.4}pre code{font-size:8pt}code{font-size:.85em}.document-footer{margin:8mm 0 0;padding:4mm 0 0;font-size:8pt;break-inside:avoid-page}}
`;
const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Evaluasi teknis KemanaYa meliputi teknologi, arsitektur, API, database, dokumentasi, hasil pengujian, dan rencana perbaikan."><title>Laporan Evaluasi Dokumen dan Aplikasi KemanaYa</title><style>${css}</style></head><body>
<a href="#ringkasan" class="skip-link">Langsung ke ringkasan</a>
<header class="toolbar"><div class="toolbar-inner"><span class="toolbar-label">KEMANAYA / LAPORAN EVALUASI TEKNIS</span><div class="toolbar-actions"><a href="#daftar-isi">Daftar isi</a><a href="#bab-19">Temuan evaluasi</a><button type="button" onclick="window.print()">Cetak / Simpan PDF</button></div></div></header>
<main class="document"><header class="cover" aria-labelledby="judul-laporan"><div><p class="eyebrow">Laporan evaluasi teknis</p><h1 id="judul-laporan">Evaluasi Dokumen<br>dan Aplikasi<span>KemanaYa</span></h1><p class="subtitle">Kajian teknologi, implementasi, kualitas dokumentasi, dan hasil pengujian aplikasi.</p></div><div><dl class="cover-meta"><div><dt>Tanggal evaluasi</dt><dd>27 Oktober 2026</dd></div><div><dt>Versi laporan</dt><dd>1.1</dd></div><div><dt>Objek evaluasi</dt><dd>Dokumentasi teknis dan aplikasi KemanaYa</dd></div><div><dt>Cakupan</dt><dd>Frontend, backend, data, API, dan operasional</dd></div></dl><p class="cover-note">Disusun berdasarkan dokumen teknis, kode implementasi, konfigurasi proyek, serta hasil pemeriksaan build dan pengujian otomatis.</p></div></header>
<div class="frontmatter">${executive}<nav class="toc" aria-labelledby="daftar-isi"><h2 id="daftar-isi">Daftar isi</h2><p class="toc-intro">Pilih judul bagian untuk menuju pembahasan terkait pada versi digital.</p><ol>${contents.map(item => `<li><a href="#${item.id}"><span class="toc-no">${item.number.padStart(2, '0')}</span><span>${esc(item.title)}</span></a></li>`).join('')}</ol></nav></div>
<div class="body-content">${blocks.join('\n')}</div><footer class="document-footer"><span>KemanaYa · Laporan Evaluasi Teknis</span><span>Versi 1.1 · 27 Oktober 2026</span></footer></main></body></html>`;
if (contents.length !== 23 || tableIndex !== labels.length || html.includes('HASIL_BACKEND_AKAN_DIISI')) throw new Error('Struktur laporan tidak lengkap');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw new Error('ID navigasi ganda');
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(anchor)) throw new Error(`Tujuan navigasi tidak ditemukan: ${anchor}`);
writeFileSync(output, html, 'utf8');
console.log(JSON.stringify({ output: fileURLToPath(output), chapters: contents.length, tables: tableIndex, words: source.split(/\s+/).length, bytes: Buffer.byteLength(html) }));
