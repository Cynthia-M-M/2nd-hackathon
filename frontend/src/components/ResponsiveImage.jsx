import { useState } from 'react'

export default function ResponsiveImage({ src, alt, className = '', sizes = '100vw', ...props }) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'
        }`}
        sizes={sizes}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  )
} 