import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Theme = 'classic' | 'sage' | 'dusty' | 'clay';

interface ThemeConfig {
  name: string;
  bgGradient: string;
  accentGradient: string;
  textPrimary: string;
  textSecondary: string;
}

const themes: Record<Theme, ThemeConfig> = {
  classic: {
    name: 'Classic Matte',
    bgGradient: 'bg-gradient-matte',
    accentGradient: 'bg-gradient-accent-dusty',
    textPrimary: 'text-matte-800',
    textSecondary: 'text-matte-600',
  },
  sage: {
    name: 'Sage Nature',
    bgGradient: 'bg-gradient-sage',
    accentGradient: 'bg-gradient-accent-sage',
    textPrimary: 'text-sage-800',
    textSecondary: 'text-sage-600',
  },
  dusty: {
    name: 'Dusty Ocean',
    bgGradient: 'bg-gradient-dusty',
    accentGradient: 'bg-gradient-accent-dusty',
    textPrimary: 'text-dusty-800',
    textSecondary: 'text-dusty-600',
  },
  clay: {
    name: 'Warm Clay',
    bgGradient: 'bg-gradient-clay',
    accentGradient: 'bg-gradient-accent-clay',
    textPrimary: 'text-clay-800',
    textSecondary: 'text-clay-600',
  },
};

export const NeuomorphicDemo = () => {
  const [activeTab, setActiveTab] = useState('buttons');
  const [currentTheme, setCurrentTheme] = useState<Theme>('classic');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('option1');

  const handleButtonClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const theme = themes[currentTheme];

  return (
    <div className={`min-h-screen ${theme.bgGradient} p-8 space-y-8 transition-colors duration-500`}>
      {/* Theme Switcher */}
      <div className="card-neumorph">
        <h2 className={`text-xl font-bold ${theme.textPrimary} mb-4`}>Theme Selection</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(themes) as Theme[]).map((themeName) => (
            <button
              key={themeName}
              onClick={() => setCurrentTheme(themeName)}
              className={`btn-neumorph-sm ${
                currentTheme === themeName ? 'neumorph-pressed' : ''
              }`}
            >
              {themes[themeName].name}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="card-neumorph p-2">
        <div className="flex space-x-2">
          {['buttons', 'cards', 'forms', 'animations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn-neumorph-sm flex-1 ${
                activeTab === tab ? 'neumorph-pressed' : ''
              } ${theme.textSecondary}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Buttons Section */}
        {activeTab === 'buttons' && (
          <section className="card-neumorph">
            <h2 className={`text-xl font-semibold ${theme.textPrimary} mb-6`}>Buttons</h2>
            <div className="space-y-6">
              {/* Regular Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="btn-neumorph">
                  Regular Button
                </button>
                <button className="btn-neumorph-sm">
                  Small Button
                </button>
                <button className={`rounded-xl px-6 py-3 ${theme.accentGradient} text-white font-medium
                                  shadow-lg hover:shadow-xl hover:scale-[1.02] 
                                  active:scale-[0.98] active:shadow-md
                                  transition-all duration-300`}>
                  Accent Button
                </button>
                <button className="btn-neumorph" disabled>
                  Disabled
                </button>
              </div>

              {/* Loading Button */}
              <button 
                className="btn-neumorph flex items-center space-x-2"
                onClick={handleButtonClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`w-4 h-4 border-2 border-current border-t-transparent rounded-full`}
                    />
                    <span>Loading...</span>
                  </>
                ) : (
                  'Click to Load'
                )}
              </button>
            </div>
          </section>
        )}

        {/* Cards Section */}
        {activeTab === 'cards' && (
          <section className="space-y-6">
            <div className="card-neumorph-interactive">
              <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>Interactive Card</h3>
              <p className={theme.textSecondary}>Hover me to see the effect</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature Cards */}
              <div className="card-neumorph">
                <div className="flex items-center space-x-4">
                  <div className={`neumorph-pressed p-3 rounded-full ${theme.accentGradient}`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${theme.textPrimary}`}>Quick Actions</h3>
                    <p className={theme.textSecondary}>Perform tasks efficiently</p>
                  </div>
                </div>
              </div>

              <div className="card-neumorph">
                <div className="flex items-center space-x-4">
                  <div className={`neumorph-pressed p-3 rounded-full ${theme.accentGradient}`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${theme.textPrimary}`}>Security First</h3>
                    <p className={theme.textSecondary}>Your data is protected</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Forms Section */}
        {activeTab === 'forms' && (
          <section className="card-neumorph">
            <h2 className={`text-xl font-semibold ${theme.textPrimary} mb-6`}>Form Elements</h2>
            <form className="space-y-6">
              <div>
                <label className={`form-label ${theme.textSecondary}`}>Username</label>
                <input 
                  type="text"
                  className="input-neumorph"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className={`form-label ${theme.textSecondary}`}>Options</label>
                <select 
                  className="select-neumorph"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox"
                  className="checkbox-neumorph"
                  id="remember"
                />
                <label htmlFor="remember" className={`form-label mb-0 ${theme.textSecondary}`}>
                  Remember me
                </label>
              </div>

              <button type="submit" className={`w-full rounded-xl px-6 py-3 ${theme.accentGradient} 
                                              text-white font-medium shadow-lg hover:shadow-xl 
                                              hover:scale-[1.02] active:scale-[0.98] active:shadow-md
                                              transition-all duration-300`}>
                Submit Form
              </button>
            </form>
          </section>
        )}

        {/* Animations Section */}
        {activeTab === 'animations' && (
          <section className="card-neumorph">
            <h2 className={`text-xl font-semibold ${theme.textPrimary} mb-6`}>Animations</h2>
            <div className="space-y-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="card-neumorph p-4"
              >
                <p className={`text-center ${theme.textSecondary}`}>Floating Animation</p>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="card-neumorph p-4"
              >
                <p className={`text-center ${theme.textSecondary}`}>Pulse Animation</p>
              </motion.div>

              <div className="flex space-x-4">
                <div className="loading-pulse card-neumorph p-4 flex-1">
                  <p className={`text-center ${theme.textSecondary}`}>Loading Pulse</p>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="card-neumorph p-4 flex-1"
                >
                  <p className={`text-center ${theme.textSecondary}`}>Rotate Animation</p>
                </motion.div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="card-neumorph text-center">
        <p className={theme.textSecondary}>Neumorphic Design System Demo</p>
      </footer>
    </div>
  );
};