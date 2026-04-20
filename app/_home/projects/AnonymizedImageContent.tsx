'use client'
import Image from "next/image"
import { useState } from "react"

type AnonymizedImageContentProps = { src: string }

export function AnonymizedImageContent({ src }: AnonymizedImageContentProps) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <Image
      src={src}
      alt=""
      fill
      className="object-cover"
      onError={() => setFailed(true)}
    />
  )
}
