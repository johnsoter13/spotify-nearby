import React from 'react';

import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

export default function ScreenWrapper({ children, options }: { children: React.ReactNode, options?: LinearGradientProps }) {
  return (
    <LinearGradient
      colors={["#6b21a8", "#1e3a8a", "#312e81"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{flex: 1}}
      {...options}
    >
      {children}
    </LinearGradient>
  );
}