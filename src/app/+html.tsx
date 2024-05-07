import type { PropsWithChildren } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        {/* THis is here */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <style type="text/css">
          {`
          body {
            overflow: hidden; /* Hide scrollbars */
          }
          .root {
            width: 100vw;
            height: 100vh;
          }
        `}
        </style>

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}

        {/* Add any additional <head> elements that you want globally available on web... */}
        {/* Preview Meta Tags */}
        <meta name="author" content="Andrew Mainella" />

        {/* OG Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="UTTT" />
        <meta
          property="og:description"
          content="Pauly, an app for students by students. Built by the 2023-2024 Student Council."
        />
        <meta
        property="og:image"
        content={`${process.env.EXPO_PUBLIC_PAULYHOST}/Pauly-og-Image.png`}
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UTTT" />
        <meta
          name="twitter:description"
          content="Pauly, an app for students by students. Built by the 2023-2024 Student Council."
        />
        <meta
          name="twitter:image"
          content={`${process.env.EXPO_PUBLIC_PAULYHOST}/Pauly-og-Image.png`}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}