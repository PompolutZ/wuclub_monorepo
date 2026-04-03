interface LogoProps {
  className?: string;
}

function Logo({ className }: LogoProps) {
  return (
    <picture>
      <source type="image/webp" srcSet="/Wunderworlds_Logo_sm.webp" />
      <img src="/Wunderworlds_Logo_sm.png" className={className} />
    </picture>
  );
}

export default Logo;
