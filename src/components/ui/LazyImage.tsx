import { useState } from "react";
import { motion } from "framer-motion";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onError?: () => void;
}

export default function LazyImage({ 
  src, 
  alt, 
  className = "", 
  imgClassName = "", 
  onError 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-border/10 ${className}`}>
      {/* Esqueleto de carga visible hasta que cargue la imagen */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-border/20 rounded-[inherit]" />
      )}
      
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        initial={{ opacity: 0, filter: "blur(10px)", scale: 1.1 }}
        animate={isLoaded ? { opacity: 1, filter: "blur(0px)", scale: 1 } : { opacity: 0, filter: "blur(10px)", scale: 1.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
        onError={onError}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
