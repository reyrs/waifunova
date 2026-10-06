// Utility to enhance anime prompts, map Indonesian descriptors to English, and prevent AI slop.

export type AnimeStyle = 'modern' | 'shinkai' | 'cyberpunk' | 'pastel'

export const STYLE_PRESETS: Record<
  AnimeStyle,
  { label: string; prefix: string; suffix: string }
> = {
  modern: {
    label: 'Modern Anime',
    prefix: 'masterpiece, highest quality, authentic 2D Japanese anime illustration, clean crisp lineart, Kyoto Animation and CloverWorks style, expressive anime eyes, vibrant cel shading',
    suffix: 'sharp focus, high definition, detailed 2D anime aesthetic, non-photorealistic, no 3D, no plastic doll skin, no blur',
  },
  shinkai: {
    label: 'Shinkai Cinematic',
    prefix: 'masterpiece, highest quality, Makoto Shinkai anime art style, breathtaking cinematic lighting, volumetric light, expansive detailed sky, vibrant rich colors, crisp anime lines',
    suffix: 'ultra-detailed background, sharp focus, high definition, cinematic anime still, non-photorealistic',
  },
  cyberpunk: {
    label: 'Tokyo Cyberpunk',
    prefix: 'masterpiece, highest quality, futuristic neo-Tokyo cyberpunk anime illustration, glowing neon signs reflections, dark rainy atmosphere, stylish streetwear, sharp digital anime lineart',
    suffix: 'volumetric neon glow, high contrast, sharp focus, crisp details, 2D anime aesthetic, non-photorealistic',
  },
  pastel: {
    label: 'Pastel Slice of Life',
    prefix: 'masterpiece, highest quality, cozy slice of life 2D anime illustration, soft warm pastel colors, gentle sunlight, soothing atmosphere, Kyoto Animation aesthetic, clean outlines',
    suffix: 'delicate shading, heartwarming vibe, sharp focus, authentic 2D anime art, no 3D CGI',
  },
}

// Common Indonesian to English anime keyword mapping
const ID_TO_EN_DICTIONARY: [RegExp, string][] = [
  [/\brambut pink\b/gi, 'pastel pink hair'],
  [/\brambut biru\b/gi, 'vibrant blue hair'],
  [/\brambut merah\b/gi, 'crimson red hair'],
  [/\brambut hitam\b/gi, 'sleek black hair'],
  [/\brambut putih\b/gi, 'silver-white hair'],
  [/\brambut coklat\b/gi, 'soft brown hair'],
  [/\brambut pirang\b/gi, 'blonde hair'],
  [/\brambut panjang\b/gi, 'long flowing hair'],
  [/\brambut pendek\b/gi, 'short bob hair'],
  [/\btelinga kucing\b/gi, 'cute cat ears, nekomimi'],
  [/\bbaju maid\b/gi, 'frilly maid outfit'],
  [/\bseragam sekolah\b/gi, 'japanese school uniform, sailor collar'],
  [/\bjaket bomber\b/gi, 'oversized bomber jacket'],
  [/\bjaket kulit\b/gi, 'black leather biker jacket'],
  [/\bhoodie\b/gi, 'oversized streetwear hoodie'],
  [/\bberkacamata\b/gi, 'stylish glasses'],
  [/\bkacamata\b/gi, 'glasses'],
  [/\bpantai sore\b/gi, 'sandy beach at golden hour sunset, ocean waves'],
  [/\bpantai\b/gi, 'scenic beach, ocean horizon'],
  [/\bmalam hujan\b/gi, 'rainy night, wet asphalt reflections'],
  [/\bhujan\b/gi, 'gentle rain, rain droplets'],
  [/\bmalam\b/gi, 'starry night sky, glowing city lights'],
  [/\bkuil\b/gi, 'traditional Japanese Shinto shrine, torii gate'],
  [/\bkimono\b/gi, 'traditional elegant Japanese floral kimono'],
  [/\bperpustakaan\b/gi, 'cozy wooden library, bookshelves'],
  [/\bkafe\b/gi, 'charming warm Japanese cafe bakery'],
  [/\bgitar\b/gi, 'electric guitar'],
  [/\bheadphone\b/gi, 'gaming headphones around neck'],
  [/\bheadset\b/gi, 'modern gaming headset'],
  [/\btersenyum\b/gi, 'warm lovely smile'],
  [/\bketawa\b/gi, 'cheerful smiling face'],
  [/\bkedip\b/gi, 'playful winking eye, mischievous grin'],
  [/\bperempuan\b/gi, 'cute anime girl'],
  [/\bgadis\b/gi, 'cute anime girl'],
  [/\bcewek\b/gi, 'anime girl'],
]

export function enhanceAnimePrompt(userPrompt: string, style: AnimeStyle = 'modern'): string {
  let translated = userPrompt.trim()

  for (const [pattern, replacement] of ID_TO_EN_DICTIONARY) {
    translated = translated.replace(pattern, replacement)
  }

  const preset = STYLE_PRESETS[style] ?? STYLE_PRESETS.modern
  return `${preset.prefix}, 1girl, ${translated}, ${preset.suffix}`
}
