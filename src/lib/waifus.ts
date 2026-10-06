export type Waifu = {
  name: string
  kana: string
  img: string
  trait: string
  bio: string
  starters: string[]
  replies: string[]
}

export const WAIFUS: Waifu[] = [
  {
    name: 'Sakura',
    kana: 'サクラ',
    img: '/art/sakura.webp',
    trait: 'Ceria, gampang ketawa',
    bio: 'Pagi-pagi udah ngirim cerita receh. Cocok buat kamu yang butuh teman ngobrol santai.',
    starters: ['Lagi ngapain?', 'Ceritain hal lucu hari ini', 'Aku lagi bosen nih'],
    replies: [
      'Hah, serius? Ceritain lagi dong, aku penasaran.',
      'Hehe, kamu lucu juga ya kalau lagi bingung gitu.',
      'Oke, aku dengerin. Terus gimana?',
      'Kalau aku jadi kamu, aku makan dulu baru mikir.',
    ],
  },
  {
    name: 'Yumi',
    kana: 'ユミ',
    img: '/art/yumi.webp',
    trait: 'Kalem, kutu buku',
    bio: 'Lebih suka dengar daripada ngomong. Kalau ditanya soal buku, bisa lupa waktu.',
    starters: ['Rekomendasiin buku dong', 'Lagi baca apa?', 'Aku butuh saran'],
    replies: [
      'Menarik. Kenapa kamu mikir begitu?',
      'Itu ngingetin aku sama novel yang lagi aku baca.',
      'Pelan-pelan aja. Aku nggak ke mana-mana.',
      'Coba lihat dari sisi lain, deh.',
    ],
  },
  {
    name: 'Aiko',
    kana: 'アイコ',
    img: '/art/aiko.webp',
    trait: 'Gamer, suka ngeledek',
    bio: 'Main ranked sampai subuh, lalu ngeledek kamu karena kalah. Tapi selalu ngajak mabar lagi.',
    starters: ['Mabar yuk', 'Aku kalah ranked terus', 'Game apa yang seru?'],
    replies: [
      'Skill issue sih itu. Bercanda, bercanda.',
      'Gas mabar abis ini? Aku carry.',
      'Yaelah, gitu doang galau. Sini aku hibur.',
      'Oke, itu keren. Dikit.',
    ],
  },
  {
    name: 'Miku',
    kana: 'ミク',
    img: '/art/miku.webp',
    trait: 'Hangat, jago masak',
    bio: 'Selalu nanya kamu udah makan belum. Punya resep buat setiap suasana hati.',
    starters: ['Aku belum makan', 'Masak apa hari ini?', 'Capek banget hari ini'],
    replies: [
      'Udah makan belum? Jangan bilang cuma kopi lagi.',
      'Aku bikinin teh anget ya, biar tenang dulu.',
      'Ceritamu bikin aku pengen masak sesuatu yang spesial.',
      'Istirahat dulu, nanti lanjut lagi.',
    ],
  },
  {
    name: 'Reina',
    kana: 'レイナ',
    img: '/art/reina.webp',
    trait: 'Cuek, anak band',
    bio: 'Gitaris band indie yang pura-pura nggak peduli. Kalau kamu sedih, dia yang pertama nyamperin.',
    starters: ['Lagi latihan?', 'Rekomendasiin lagu', 'Hari ini berat'],
    replies: [
      'Hmph. Bukan berarti aku khawatir, ya.',
      'Lagu baru kami selesai. Kamu orang pertama yang tahu.',
      'Ya udah, cerita aja. Aku dengerin.',
      'Jangan kebanyakan mikir. Ayo jalan.',
    ],
  },
]

export const getWaifu = (name: string | null | undefined) =>
  WAIFUS.find((w) => w.name === name) ?? WAIFUS[0]
