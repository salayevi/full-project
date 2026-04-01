export type ProductColor = {
  name: string
  hex: string
  preview?: string
}

export type ProductAction = {
  label: string
  href?: string
  type?: "primary" | "secondary"
}

export type ProductMedia = {
  type: "image" | "video"
  src: string
  poster?: string
  alt?: string
  hasTransparentBg?: boolean
}

export type Product = {
  id: string
  slug: string
  name: string
  subtitle?: string
  description: string
  price?: string
  badge?: string

  theme: {
    bg: string
    text: string
    accent: string
    muted?: string
    card?: string
    tone?: "light" | "dark"
  }

  mediaPanel: {
    mode: "imageTone" | "forceBlack" | "forceWhite"
    color?: string
  }

  media: ProductMedia
  colors: ProductColor[]
  actions: ProductAction[]
}