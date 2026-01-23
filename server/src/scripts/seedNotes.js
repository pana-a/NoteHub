const admin = require('firebase-admin')
const serviceAccount = require('../../serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
const notesCollection = db.collection('notes')

//!!!Replace with actual user ID
const OWNER_ID = 'REPLACE_WITH_USER_ID'

const now = new Date().toISOString()

const seedNotes = [
  {
    title: 'PPOO - Structuri de date în Java',
    content:
      'Structurile de date de bază în Java includ ArrayList, LinkedList, Stack, Queue și Map. Alegerea structurii potrivite influențează performanța aplicației și claritatea codului.',
    tags: ['java', 'PPOO', 'curs'],
    ownerId: OWNER_ID,
    sharedWith: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'SBD - Introducere în baze de date NoSQL',
    content:
      'Bazele de date NoSQL sunt concepute pentru scalabilitate și flexibilitate. Modele frecvente: document, key-value, column și graph.',
    tags: ['nosql', 'baze-date', 'SBD'],
    ownerId: OWNER_ID,
    sharedWith: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'MPA - Managementul proceselor de afaceri',
    content:
      'BPM se concentrează pe analiza și optimizarea proceselor de business. Obiectivul este eficiența și reducerea costurilor.',
    tags: ['BPM', 'MPA', 'seminar'],
    ownerId: OWNER_ID,
    sharedWith: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'MPA - Optimizarea proceselor',
    content:
      'Optimizarea proceselor presupune identificarea blocajelor și automatizarea activităților repetitive.',
    tags: ['business', 'optimizare', 'procese'],
    ownerId: OWNER_ID,
    sharedWith: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'SMA - Indicatori statistici',
    content:
      'Indicatorii statistici principali sunt media, mediana, modul și abaterea standard. Aceștia sunt utilizați în analiza deciziilor de business.',
    tags: ['statistica', 'indicatori'],
    ownerId: OWNER_ID,
    sharedWith: [],
    createdAt: now,
    updatedAt: now
  },
  {
    title: 'SMA - Corelație și cauzalitate',
    content:
      'Corelația indică legătura dintre variabile, dar nu implică automat o relație de cauzalitate.',
    tags: ['statistica'],
    ownerId: OWNER_ID,
    sharedWith: [],
    createdAt: now,
    updatedAt: now
  }
]

async function runSeed() {
  console.log('Seeding notes...')

  for (const note of seedNotes) {
    await notesCollection.add(note)
  }

  console.log('Seed complet: 10 notițe adăugate')
  process.exit(0)
}

runSeed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
