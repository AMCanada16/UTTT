import { Redirect } from 'expo-router';
import React from 'react';

/** This screen redirects the user home if they aren't where they should be. */
export default function NotFound() {
  return <Redirect href={"/"}/>
}