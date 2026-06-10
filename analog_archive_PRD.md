# Analog Archive — Product Requirements Document
**Matteo Morandini — v1.0**

---

## 1. Panoramica del progetto

Analog Archive è un'applicazione web personale per la gestione completa del workflow fotografico analogico. Copre tre fasi: archiviazione dei rullini e negativi, registrazione dei dati di sviluppo, documentazione delle sessioni di stampa in camera oscura.

L'entità centrale è l'Archivio Negativi. Da essa si accede a tutte le informazioni collegate: ogni rullino contiene i suoi fotogrammi, ogni fotogramma registra le sessioni di stampa associate.

### 1.1 Obiettivi

- Archiviare tutti i rullini fotografici con dati di ripresa e sviluppo
- Tracciare ogni sessione di stampa collegata al negativo di origine
- Permettere ricerca e filtraggio rapido dell'intero archivio
- Esportare in PDF le schede di rullino, negativo e sessione di stampa
- Essere accessibile da computer e dispositivi mobile senza installazione

### 1.2 Utenti e autenticazione

Applicazione a utente singolo (Matteo Morandini). Nessun sistema di autenticazione o login richiesto. Nessun supporto multi-utente previsto in v1.0.

---

## 2. Architettura dei dati

Il modello dati si articola in tre entità principali con relazioni gerarchiche:

| Entità | Relazione |
|---|---|
| **RULLINO** | Entità radice. Identificato da codice archivio (es. `135/01`). Contiene i dati di ripresa e di sviluppo. |
| **NEGATIVO** | Appartiene a un rullino. Rappresenta il singolo fotogramma. È il punto di accesso alle sessioni di stampa. |
| **SESSIONE DI STAMPA** | Appartiene a un negativo. Più sessioni possono riferirsi allo stesso negativo, ognuna con parametri indipendenti. |

**Schema gerarchico:**

```
RULLINO (135/01)  →  NEGATIVO (fotogramma n.)  →  SESSIONI DI STAMPA
```

---

## 3. Entità: RULLINO

Il rullino è l'unità fondamentale dell'archivio. Ogni rullino ha un'unica scheda che raccoglie i dati di ripresa e quelli di sviluppo.

### 3.1 Codice archivio

Il codice viene generato automaticamente nel formato `FORMATO/PROGRESSIVO`, con serie separate per formato:

- Formato 35mm: `135/01`, `135/02`, `135/03` …
- Formato 120: `120/01`, `120/02`, `120/03` …

Il numero progressivo è sequenziale e non riutilizzabile. Il campo è di sola lettura dopo la creazione.

### 3.2 Campi — Info ripresa

| Campo | Tipo / Valori | Note |
|---|---|---|
| Codice archivio | Testo generato auto (es. `135/01`) | Chiave univoca, non modificabile |
| Pellicola | Testo libero | Es. Kentmere Pan 200, Fomapan 400 |
| Formato | Selezione: `135` / `120` | Determina la serie di numerazione |
| Sensibilità (ISO) | Numero intero | ISO nominale o di esposizione effettivo |
| Fotocamera | Testo libero | Es. Zenza Bronica S2A, Canon AE-1 |
| Focale | Testo libero | Es. 75mm f/2.8, 50mm f/1.8 |
| Data scatti | Data (gg/mm/aaaa) | Data di ripresa o inizio del periodo |
| Scene | Testo libero (lungo) | Descrizione generale del contenuto del rullino |
| Provino a contatto | Booleano (Sì / No) | Indica se il provino è stato realizzato |

### 3.3 Campi — Info sviluppo

| Campo | Tipo / Valori | Note |
|---|---|---|
| Prodotto sviluppo | Testo libero | Es. Bellini Hydrofen |
| Diluizione | Testo libero | Es. 1+30, 1+31 |
| Tempo sviluppo | Testo libero | Es. 8 min, 10 min 30 sec |
| Temperatura | Numero decimale (°C) | Es. 20.0 |
| Data sviluppo | Data (gg/mm/aaaa) | |
| Note sviluppo | Testo libero (lungo) | Osservazioni sulla sessione di sviluppo |

---

## 4. Entità: NEGATIVO

Il negativo appartiene a un rullino e rappresenta il singolo fotogramma. È il punto di accesso alle sessioni di stampa.

### 4.1 Identificazione

Ogni negativo è identificato dalla coppia **Codice rullino + Numero fotogramma** (es. `135/01 — fotogramma 12`). Il numero fotogramma è un intero progressivo all'interno del rullino.

### 4.2 Campi

| Campo | Tipo / Valori | Note |
|---|---|---|
| Rullino (riferimento) | Codice archivio | Chiave esterna verso il rullino |
| Numero fotogramma | Numero intero | Progressivo nel rullino (es. 1, 12, 36) |
| Scena | Testo libero (breve) | Titolo sintetico del soggetto fotografato |
| Descrizione negativo | Testo libero (lungo) | Descrizione dettagliata del fotogramma |
| Scansione (opzionale) | Upload immagine | Funzione opzionale, non prioritaria in v1.0 |

### 4.3 Vista scheda negativo

Dalla scheda negativo devono essere visibili:

- Dati del rullino di appartenenza (in sola lettura, sezione comprimibile)
- Elenco di tutte le sessioni di stampa collegate, con data e parametri principali
- Pulsante per aggiungere una nuova sessione di stampa

---

## 5. Entità: SESSIONE DI STAMPA

Una sessione di stampa documenta una singola lavorazione in camera oscura per uno specifico negativo. Lo stesso negativo può avere più sessioni di stampa, ciascuna con parametri indipendenti.

### 5.1 Campi — Riferimenti

| Campo | Tipo / Valori | Note |
|---|---|---|
| Negativo (riferimento) | Rullino + Fotogramma | Chiave esterna verso il negativo |
| Data stampa | Data (gg/mm/aaaa) | |
| Carta fotografica | Testo libero | Marca e tipo di carta usata |
| Formato stampa | Testo libero | Es. 18x24, 24x30 |

### 5.2 Campi — Parametri ingranditore

| Campo | Tipo / Valori | Note |
|---|---|---|
| Filtro contrasto | Testo libero | Es. 2.5, 3, 00 — per carta multigrado |
| Apertura obiettivo | Testo libero | Es. f/8, f/11 |
| Tempo di esposizione | Testo libero | Es. 12 sec, 8 sec |

### 5.3 Campi — Chimica camera oscura

| Campo | Tipo / Valori | Note |
|---|---|---|
| Sviluppo — Prodotto | Testo libero | Marca del prodotto |
| Sviluppo — Temperatura | Numero decimale (°C) | |
| Sviluppo — Tempo | Testo libero | Es. 1 min 30 sec |
| Stop — Prodotto | Testo libero | Marca del prodotto |
| Stop — Temperatura | Numero decimale (°C) | |
| Stop — Tempo | Testo libero | |
| Fissaggio — Prodotto | Testo libero | Marca del prodotto |
| Fissaggio — Temperatura | Numero decimale (°C) | |
| Fissaggio — Tempo | Testo libero | |

### 5.4 Campi — Interventi e note

| Campo | Tipo / Valori | Note |
|---|---|---|
| Interventi | Testo libero (lungo) | Mascherature, bruciature, variazioni di tempo, altri interventi in camera oscura |
| Note | Testo libero (lungo) | Osservazioni generali sulla sessione |
| Foto stampa (opzionale) | Upload immagine | Funzione opzionale, non prioritaria in v1.0 |

---

## 6. Interfaccia utente e navigazione

### 6.1 Schermate principali

| Schermata | Descrizione |
|---|---|
| Archivio Negativi | Schermata principale. Lista di tutti i rullini con filtri e ricerca testuale. Punto di ingresso per tutte le navigazioni. |
| Scheda Rullino | Dati del rullino (ripresa + sviluppo) e lista dei fotogrammi con scena associata. |
| Scheda Negativo | Dati del fotogramma, rullino di appartenenza (comprimibile), elenco sessioni di stampa collegate. |
| Scheda Sessione di Stampa | Tutti i parametri di una sessione. Navigazione diretta al negativo e al rullino di provenienza. |
| Form Creazione / Modifica | Form per rullino, negativo, sessione di stampa. Layout ottimizzato per mobile. |

### 6.2 Filtri e ricerca — Archivio Negativi

La schermata archivio supporta i seguenti filtri, combinabili tra loro:

- Formato (`135` / `120`)
- Data scatti (intervallo di date)
- Pellicola (selezione da valori già inseriti in archivio)
- Fotocamera (selezione da valori già inseriti in archivio)
- Ricerca testuale libera su: scene, descrizione negativo, note sviluppo, note sessioni di stampa
- Ordinamento per data (crescente/decrescente) e per codice archivio

### 6.3 Navigazione

Breadcrumb su tutte le schermate interne:

```
Archivio  ›  Rullino 135/01  ›  Fotogramma 12  ›  Stampa del 12/03/2025
```

### 6.4 Requisiti mobile

- Layout responsive, usabile su smartphone
- Form di inserimento utilizzabili con tastiera mobile
- Navigazione accessibile con una mano

---

## 7. Esportazione PDF

Ogni scheda principale deve essere esportabile in PDF tramite un pulsante dedicato. Il file viene scaricato direttamente dal browser.

### 7.1 Schede esportabili

- Scheda Rullino: dati ripresa + sviluppo + elenco fotogrammi
- Scheda Negativo: dati fotogramma + dati rullino + elenco sessioni di stampa collegate
- Scheda Sessione di Stampa: tutti i parametri della singola sessione

### 7.2 Formato

- Foglio A4, orientamento verticale
- Layout tabellare coerente con i documenti di riferimento
- Intestazione con nome utente e codice archivio

---

## 8. Stack tecnico

| Componente | Scelta | Note |
|---|---|---|
| Framework | Next.js (React) — App Router | Full-stack, SSR, ottimo per app responsive |
| Database | PostgreSQL su Supabase | Cloud hosted, tier gratuito, SQL relazionale |
| ORM | Prisma | Schema dichiarativo, migrazione automatica |
| Stile UI | Tailwind CSS + shadcn/ui | Responsive, componenti accessibili |
| Export PDF | react-pdf o Puppeteer | react-pdf per client-side; Puppeteer per rendering HTML fedele |
| Upload immagini | Supabase Storage | Per funzioni opzionali di upload |
| Deploy | Vercel | Deploy automatico da Git, tier gratuito adeguato |

### 8.1 Struttura cartelle

```
/app          → pagine e layout Next.js (App Router)
/components   → componenti UI riutilizzabili (form, tabelle, schede)
/lib          → funzioni di utilità, query database, generazione PDF
/prisma       → schema Prisma e file di migrazione
/public       → asset statici
```

---

## 9. Schema database (Prisma)

```prisma
model Rullino {
  id               Int        @id @default(autoincrement())
  codiceArchivio   String     @unique   // es. "135/01"
  formato          String               // "135" | "120"
  pellicola        String
  sensibilita      Int?
  fotocamera       String?
  focale           String?
  dataScatti       DateTime?
  scene            String?
  provinoContatto  Boolean    @default(false)
  prodottoSviluppo String?
  diluizione       String?
  tempoSviluppo    String?
  tempSviluppo     Float?
  dataSviluppo     DateTime?
  noteSviluppo     String?
  negativi         Negativo[]
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
}

model Negativo {
  id               Int        @id @default(autoincrement())
  rullinoId        Int
  rullino          Rullino    @relation(fields: [rullinoId], references: [id])
  numeroFotogramma Int
  scena            String?
  descrizione      String?
  scansioneUrl     String?    // opzionale
  stampe           SessioneStampa[]
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
  @@unique([rullinoId, numeroFotogramma])
}

model SessioneStampa {
  id               Int        @id @default(autoincrement())
  negativoId       Int
  negativo         Negativo   @relation(fields: [negativoId], references: [id])
  dataStampa       DateTime?
  carta            String?
  formatoStampa    String?
  filtroContrasto  String?
  aperturaObj      String?
  tempoEsposizione String?
  svil_prodotto    String?
  svil_temp        Float?
  svil_tempo       String?
  stop_prodotto    String?
  stop_temp        Float?
  stop_tempo       String?
  fiss_prodotto    String?
  fiss_temp        Float?
  fiss_tempo       String?
  interventi       String?
  note             String?
  fotoStampaUrl    String?    // opzionale
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
}
```

---

## 10. Requisiti non funzionali

### 10.1 Performance

- Archivio con fino a 500 rullini: caricamento < 2 secondi
- Ricerca testuale: risultati in tempo reale o latenza < 500ms
- Export PDF: generazione < 5 secondi per scheda singola

### 10.2 Compatibilità

- Browser: Chrome, Firefox, Safari — desktop e mobile
- Validazione inline nei form: campi obbligatori evidenziati prima del salvataggio
- Conferma richiesta prima di qualsiasi eliminazione

### 10.3 Dati e backup

- Backup automatico delegato a Supabase (incluso nel servizio)
- I campi opzionali (upload immagini) non bloccano il salvataggio della scheda

### 10.4 Fuori scope — v1.0

- Autenticazione / login
- Supporto multi-utente
- Import da archivi esistenti (CSV o altro)
- App nativa iOS/Android
- Statistiche e dashboard analitiche
- Integrazione con software di terze parti

---

## 11. Priorità di sviluppo

Ordine per lo sviluppo incrementale con Claude Code. Completare e validare ogni step prima di procedere al successivo.

| Step | Obiettivo | Contenuto |
|---|---|---|
| Step 1 | Setup progetto | Next.js + Supabase + Prisma + deploy Vercel |
| Step 2 | Schema database | Migrazione Prisma: Rullino, Negativo, SessioneStampa |
| Step 3 | Archivio Negativi | Lista rullini con filtri combinabili e ricerca testuale |
| Step 4 | CRUD Rullino | Creazione, visualizzazione, modifica, eliminazione |
| Step 5 | CRUD Negativo | Gestione fotogrammi con collegamento al rullino |
| Step 6 | CRUD Sessione di Stampa | Gestione sessioni con collegamento al negativo |
| Step 7 | Export PDF | Generazione PDF per le tre tipologie di scheda |
| Step 8 | Upload immagini | Funzioni opzionali: scansioni negativi e foto stampe |

> **Nota per Claude Code:** procedere uno step alla volta. Validare il funzionamento completo di ogni step prima di passare al successivo. Non anticipare funzionalità degli step successivi.
