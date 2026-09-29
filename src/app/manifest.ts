import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Daily Dare", short_name: "Daily Dare", id: "/", start_url: "/", scope: "/",
    display: "standalone", background_color: "#ffffff", theme_color: "#171717",
    icons: [192, 512].map((size) => ({ src: `/icons/dare-${size}.png?v=3`, sizes: `${size}x${size}`, type: "image/png", purpose: "any" })),
  };
}
