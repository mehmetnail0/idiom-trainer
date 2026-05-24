# Idiom Trainer

English idiom drill tool — Claude Code session içinde çalışır. Ayrı app yok, Claude kendisi quiz yapar.

## Nasıl Çalışır

Kullanıcı "idiom drill", "idiom quiz", "idiom session" veya benzeri dediğinde:

1. `idioms.json` dosyasını oku
2. Spaced repetition'a göre sıra belirle (aşağıdaki kurallara göre)
3. 8-12 soru sor (AskUserQuestion tool ile — kullanıcı seçenek tıklasın)
4. Her cevaptan sonra doğru/yanlış feedback ver
5. Session sonunda özet göster
6. `idioms.json`'u güncellenmiş haliyle kaydet (Write tool)
7. Git commit at: `git add idioms.json && git commit -m "drill: <tarih> — X/Y correct"`

## Soru Seçim Kuralları (Spaced Repetition)

1. `status: "new"` olan idiom'lar öncelikli (ilk kez görecek)
2. `nextDue` tarihi geçmiş `"learning"` idiom'lar ikinci sıra
3. `nextDue` tarihi geçmiş `"mastered"` idiom'lar üçüncü sıra
4. Her session'da karışık kategori (founder/colloquial/business) — tek kategoriye takılma
5. Session başına 8-12 idiom seç

## Soru Tipleri (her session karışık)

### Type 1 — Fill in the Blank (~30%)
Cümlede idiom'un yerine ___ koy, 4 seçenek sun.
Seçenekler aynı kategoriden diğer idiom'lardan gelsin.

### Type 2 — Meaning Match (~30%)
Idiom phrase göster, "anlamı hangisi?" sor, 4 seçenek.

### Type 3 — Context Usage (~20%)
"Hangi cümlede X doğru kullanılmış?" — 1 doğru (orijinal example), 3 yanlış (diğer idiom'ların example'ındaki phrase'i X ile değiştir).

### Type 4 — Production (~20%)
"X idiom'unu kullanarak NailingAI/startup bağlamında 1-2 cümle yaz."
Kullanıcı yazar, Claude değerlendirir:
- ✓ correct: doğal ve anlamlı kullanım
- ⚠ half: fikir doğru ama ifade kötü
- ✗ wrong: anlam yanlış veya yapay
Her zaman 1 "sharper alternative" cümle öner.

## Cevap Sonrası Güncelleme

Doğru cevap:
- `correct++`
- `lastSeen` = bugünün ISO tarihi (YYYY-MM-DD)
- `nextDue` = bugün + (correct × 2) gün
- `new` → `learning`
- `learning` + correct >= 3 → `mastered`

Yanlış cevap:
- `wrong++`
- `lastSeen` = bugün
- `nextDue` = yarın
- `mastered` → `learning`

## Session Sonu

Göster:
- X/Y doğru (yüzde)
- Yeni mastered olanlar
- Streak güncelle (meta.streak): ardışık gün = +1, aynı gün = aynı, koptu = 1
- `meta.lastSessionDate` = bugün (YYYY-MM-DD)
- `meta.totalSessions++`

## Stats Komutu

"idiom stats" dendiğinde:
- Mastered / Learning / New sayıları
- Streak
- En çok yanlış 5 idiom (weakness report)
- Bu hafta drill edilen idiom'lar

## Yeni Idiom Ekleme

Kullanıcı yeni idiom verdiğinde (tek tek veya liste halinde):
1. Her idiom için meaning, example, category, difficulty belirle (Claude belirler, kullanıcıya sormadan)
2. Example cümlesi founder/startup/creator bağlamında olsun
3. `idioms.json`'a ekle (id: `c<timestamp>` formatında)
4. Commit at + push

Kullanıcı sadece phrase verir, gerisini Claude doldurur. Eğer kullanıcı meaning de verdiyse onu kullan.

## AskUserQuestion Formatı

Multiple choice sorular için AskUserQuestion tool kullan:
- header: soru tipi (örn "Fill Blank")
- question: soru metni
- options: 4 seçenek (label + description)
- multiSelect: false

Production (Type 4) soruları için AskUserQuestion KULLANMA — düz text olarak sor, kullanıcı cevabını yazsın.

## Önemli

- Session sırasında her sorudan sonra hemen feedback ver (doğru/yanlış + açıklama)
- Türkçe konuş ama idiom'lar ve example'lar İngilizce kalsın
- Session sonunda idioms.json'u MUTLAKA güncelle + commit at
- Production sorularında Claude kendisi değerlendirir (harici API çağrısı YOK)
