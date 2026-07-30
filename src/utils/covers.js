export const ARTIST_COVERS = {
  'Crayon Case': 'https://f4.bcbits.com/img/a3253599809_10.jpg',
  'Reality Club': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwYfNnHtyWEVqP4fl087k7QOQJIexWOH9TX-k8i5fDqA&s',
  'The Milo': 'https://i.scdn.co/image/ab67616d0000b273d848576bdd6be0a638cca09b',
  'Wave to Earth': 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/16/ec/bf16ec6f-d1ca-51bb-dc80-aa1e3a479ff7/cover_W2E.jpg/600x600bb.jpg',
};

export const CONCERT_BRANCH_COVERS = {
  // Reality Club Branches
  'reality-club-city-lights-jakarta-2026': 'https://assets.loket.com/neo/production/images/banner/20260116203736_696a3f2030a5c.jpg',
  'reality-club-city-lights-bandung-2026': 'https://assets.loket.com/neo/production/images/banner/20240715172204_6694f84ca9df5.jpg',
  'reality-club-city-lights-yogyakarta-2026': 'https://assets.loket.com/neo/production/images/banner/20240715172509_6694f905750e9.jpg',

  // The Milo Branches
  'the-milo-acoustic-jakarta-2026': 'https://i.scdn.co/image/ab67616d0000b273d848576bdd6be0a638cca09b',
  'the-milo-acoustic-surabaya-2026': 'https://i.scdn.co/image/ab67616d0000b273df3a0ec97de41c2cfadf70c5',
  'the-milo-acoustic-yogyakarta-2026': 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/84/37/4d/84374dc2-ffef-193a-eb80-0a5eb5b01ce4/artwork.jpg/600x600bb.jpg',

  // Wave to Earth Branches
  'wave-to-earth-flaws-and-all-jakarta-2026': 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/bf/16/ec/bf16ec6f-d1ca-51bb-dc80-aa1e3a479ff7/cover_W2E.jpg/600x600bb.jpg',
  'wave-to-earth-flaws-and-all-surabaya-2026': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOcuS9GbJkWZ3XG2ISFvtzV7EbPJzcVmKZ-X8Y5YqXx_ZdlxmgqANb-Nbb&s=10',

  // Crayon Case
  'crayon-case-live-in-jakarta-2026': 'https://f4.bcbits.com/img/a3253599809_10.jpg',
};

const DEFAULT_POSTER = 'https://f4.bcbits.com/img/a3253599809_10.jpg';

export function getConcertPoster(concert) {
  if (!concert) return DEFAULT_POSTER;

  // 1) Explicit poster / image_url property
  if (concert.poster_image && concert.poster_image.startsWith('http')) return concert.poster_image;
  if (concert.image_url && concert.image_url.startsWith('http')) return concert.image_url;

  // 2) Branch slug override
  if (concert.slug && CONCERT_BRANCH_COVERS[concert.slug]) {
    return CONCERT_BRANCH_COVERS[concert.slug];
  }

  // 3) Artist cover fallback
  if (concert.artist_name && ARTIST_COVERS[concert.artist_name]) {
    return ARTIST_COVERS[concert.artist_name];
  }

  return DEFAULT_POSTER;
}
