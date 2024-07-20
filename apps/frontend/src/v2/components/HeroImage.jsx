import React from 'react';

function HeroImage() {
    return (
      <picture>
        <source
          type="image/avif"
          srcSet="/assets/wyrdhollow_bg_xs.avif 375w, /assets/wyrdhollow_bg_lg.avif 1000w"
        />
        <source
          type="image/webp"
          srcSet="/assets/wyrdhollow_bg_xs.webp 375w, /assets/wyrdhollow_bg_lg.webp 1000w"
        />
        <img
          srcSet="/assets/wyrdhollow_bg_xs.jpg 375w, /assets/wyrdhollow_bg_lg.jpg 1000w"
          alt="Stormcast Eternal surrounded by Ephilims Pandemonium"
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
