import React from 'react';

function HeroImage() {
    return (
      <picture>
        <source
          type="image/avif"
          srcSet="/assets/hero/Background_Texture_Green.avif"
        />
        <source
          type="image/webp"
          srcSet="/assets/hero/Background_Texture_Green.webp"
        />
        <img
          srcSet="/assets/hero/Background_Texture_Green.jpg"
          alt="Green shattered glass background"
          style={{
            width: "100%",
            height: "70%",
            objectFit: "cover",
          }}
        />
      </picture>
    );
}

export default HeroImage;
