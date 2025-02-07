/*
  Sudoku pulled from Garage Way
  Andrew Mainella
  11 September 2024
*/
import { Colors } from '@types';
import Head from 'expo-router/head';
import React from 'react'

export default function MetaTags({
  title,
  description,
  image
}:{
  title: string;
  description: string;
  image: string;
}) {
  return (
    <Head> 
      <meta name="apple-itunes-app" content="app-id=6445966725" />

      <title>{title}</title>
      <meta name="description" content={description}/>
      {/* Preview Meta Tags */}
      <meta name="author" content="Andrew Mainella" />

      {/* OG Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={description}
      />
      <meta
        property="og:image"
        content={image}
      />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta
        name="twitter:description"
        content={description}
      />
      <meta
        name="twitter:image"
        content={image}
      />
      <meta name="theme-color" content={Colors.main}/>
    </Head>
  )
}