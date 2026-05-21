import { Helmet } from "react-helmet-async";

const DOMAIN = "https://cartivoshop.vercel.app";

const makeAbsoluteUrl = (path, defaultVal) => {
    if (!path) return defaultVal;
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${DOMAIN}${cleanPath}`;
};

const SEO = ({
    title = "Cartivo - Modern Ecommerce Store",
    description = "Shop fashion, electronics, groceries, mobiles and more at Cartivo with secure checkout and fast delivery.",
    keywords = "cartivo, ecommerce, online shopping, fashion, electronics, mobiles",
    image = "/og-image.png",
    url,
    type = "website"
}) => {
    // Dynamically fallback to window.location.href if url is not provided
    const rawUrl = url || (typeof window !== "undefined" ? window.location.href : DOMAIN);
    const absoluteUrl = makeAbsoluteUrl(rawUrl, DOMAIN);
    const absoluteImage = makeAbsoluteUrl(image, `${DOMAIN}/og-image.png`);

    return (
        <Helmet>
            <title>{title}</title>

            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Cartivo" />
            <meta name="robots" content="index, follow" />

            <link rel="canonical" href={absoluteUrl} />

            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:url" content={absoluteUrl} />
            <meta property="og:site_name" content="Cartivo" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />

            <meta name="theme-color" content="#6366f1" />
        </Helmet>
    );
};

export default SEO;