import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define different color themes
const colorThemes = {
  default: {
    primaryDark: '#1a237e',
    primaryLight: '#534bae',
    accentBlue: '#2196f3',
    bgGradientStart: '#e8eaf6',
    bgGradientEnd: '#bbdefb',
    textPrimary: '#2c3e50',
    textSecondary: '#546e7a',
    accentSuccess: '#4caf50',
    accentWarning: '#ff9800',
    accentError: '#f44336',
    borderLight: '#e3e8ef',
    borderFocus: '#2196f3',
  },
  ocean: {
    primaryDark: '#006064',
    primaryLight: '#0097a7',
    accentBlue: '#00bcd4',
    bgGradientStart: '#e0f7fa',
    bgGradientEnd: '#b2ebf2',
    textPrimary: '#263238',
    textSecondary: '#455a64',
    accentSuccess: '#009688',
    accentWarning: '#26a69a',
    accentError: '#ef5350',
    borderLight: '#b2ebf2',
    borderFocus: '#00bcd4',
  },
  sunset: {
    primaryDark: '#bf360c',
    primaryLight: '#f4511e',
    accentBlue: '#ff5722',
    bgGradientStart: '#fbe9e7',
    bgGradientEnd: '#ffccbc',
    textPrimary: '#3e2723',
    textSecondary: '#5d4037',
    accentSuccess: '#ff9800',
    accentWarning: '#ffb74d',
    accentError: '#d32f2f',
    borderLight: '#ffccbc',
    borderFocus: '#ff5722',
  },
  forest: {
    primaryDark: '#1b5e20',
    primaryLight: '#2e7d32',
    accentBlue: '#4caf50',
    bgGradientStart: '#e8f5e9',
    bgGradientEnd: '#c8e6c9',
    textPrimary: '#1b5e20',
    textSecondary: '#2e7d32',
    accentSuccess: '#81c784',
    accentWarning: '#fff176',
    accentError: '#e57373',
    borderLight: '#c8e6c9',
    borderFocus: '#4caf50',
  },
};

const updateCSSVariables = (theme: typeof colorThemes.default) => {
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssKey}`, value);
  });
};

export const TestStyles = () => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [glassEffect, setGlassEffect] = useState(false);
  const [elevation, setElevation] = useState('medium');
  const [animation, setAnimation] = useState('none');
  const [showEffects, setShowEffects] = useState(true);

  const applyTheme = (themeName: keyof typeof colorThemes) => {
    const theme = colorThemes[themeName];
    updateCSSVariables(theme);
    setCurrentTheme(themeName);
    
    document.body.style.backgroundColor = theme.bgGradientStart;
    setTimeout(() => {
      document.body.style.backgroundColor = '';
    }, 100);
  };

  useEffect(() => {
    applyTheme('default');
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setShowEffects(!showEffects)}
          className="btn-animated"
        >
          {showEffects ? 'Hide' : 'Show'} Style Tester
        </button>
      </div>

      {showEffects && (
        <div className="space-y-8">
          {/* Theme Switcher */}
          <section className="card-modern p-6 space-y-4">
            <h2 className="text-xl font-bold text-gradient-animated">Theme Switcher</h2>
            <div className="flex flex-wrap gap-4">
              {Object.keys(colorThemes).map((theme) => (
                <button
                  key={theme}
                  onClick={() => applyTheme(theme as keyof typeof colorThemes)}
                  className={`btn-animated ${
                    currentTheme === theme
                      ? 'ring-2 ring-primary-dark ring-opacity-50'
                      : ''
                  }`}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          </section>

          {/* Effect Controls */}
          <section className="gradient-border">
            <div className="gradient-border-content space-y-4">
              <h2 className="text-xl font-bold text-gradient">Effect Controls</h2>
              <div className="space-y-4">
                {/* Glass Effect Toggle */}
                <div>
                  <label className="form-label">Glass Effect</label>
                  <button
                    onClick={() => setGlassEffect(!glassEffect)}
                    className={`btn-animated ${glassEffect ? 'glass' : ''}`}
                  >
                    Toggle Glass Effect
                  </button>
                </div>

                {/* Elevation Controls */}
                <div>
                  <label className="form-label">Elevation</label>
                  <div className="flex gap-4">
                    {['low', 'medium', 'high'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setElevation(level)}
                        className={`neumorphic px-4 py-2 ${
                          elevation === level ? 'shadow-lg' : ''
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Controls */}
                <div>
                  <label className="form-label">Animation</label>
                  <div className="flex gap-4">
                    {['none', 'bounce', 'pulse', 'shake'].map((anim) => (
                      <motion.button
                        key={anim}
                        onClick={() => setAnimation(anim)}
                        className="btn-animated"
                        animate={animation === anim ? {
                          y: anim === 'bounce' ? [0, -10, 0] : 0,
                          scale: anim === 'pulse' ? [1, 1.1, 1] : 1,
                          x: anim === 'shake' ? [-5, 5, -5, 5, 0] : 0,
                        } : {}}
                        transition={{ repeat: animation === anim ? Infinity : 0 }}
                      >
                        {anim.charAt(0).toUpperCase() + anim.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Modern Effects Showcase */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gradient-animated">Modern Effects</h2>
            
            {/* Modern Card */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold">Modern Card</h3>
              <p>Hover to see the gradient overlay effect</p>
            </div>

            {/* Gradient Border Card */}
            <div className="gradient-border">
              <div className="gradient-border-content">
                <h3 className="text-lg font-semibold">Gradient Border</h3>
                <p>Card with animated gradient border</p>
              </div>
            </div>

            {/* Floating Label Input */}
            <div className="float-label-input">
              <input type="text" placeholder=" " />
              <label>Floating Label</label>
            </div>

            {/* Glass Card */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold">Glass Card</h3>
              <p>Modern glassmorphism effect</p>
            </div>

            {/* Neumorphic Card */}
            <div className="neumorphic p-6">
              <h3 className="text-lg font-semibold">Neumorphic Design</h3>
              <p>Soft UI effect</p>
            </div>

            {/* Shimmer Effect */}
            <div className="card shimmer p-6">
              <h3 className="text-lg font-semibold">Shimmer Effect</h3>
              <p>Animated loading state</p>
            </div>

            {/* Animated Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Animated Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn-animated">
                  Hover Me
                </button>
                <button className="btn-animated glass">
                  Glass Button
                </button>
                <button className="neumorphic px-6 py-3">
                  Neumorphic
                </button>
              </div>
            </div>
          </section>

          {/* Color Palette Display */}
          <section className="glass-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gradient">Current Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 bg-primary-dark rounded-lg shimmer"></div>
                <p className="text-sm text-text-secondary">Primary Dark</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-primary-light rounded-lg shimmer"></div>
                <p className="text-sm text-text-secondary">Primary Light</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-accent-blue rounded-lg shimmer"></div>
                <p className="text-sm text-text-secondary">Accent</p>
              </div>
              <div className="space-y-2">
                <div className="h-20 bg-accent-success rounded-lg shimmer"></div>
                <p className="text-sm text-text-secondary">Success</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};