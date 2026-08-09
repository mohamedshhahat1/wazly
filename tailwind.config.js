/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // IBM Plex Sans Arabic carries both scripts, so Arabic and Latin share
        // one voice instead of fighting each other. Inter stays as the Latin
        // fallback and is available explicitly via `font-latin`.
        sans: ['"IBM Plex Sans Arabic"', 'Inter', 'system-ui', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
        latin: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Deep teal. 600 is the specified primary; the rest is derived inside
        // the same hue family so tints never drift toward blue.
        brand: {
          50: '#eef6f4',
          100: '#d5eae6',
          200: '#acd6ce',
          300: '#7bbcb1',
          400: '#4a9e92',
          500: '#1e8a7d',
          600: '#087f73',
          700: '#076c62',
          800: '#075851',
          900: '#064540',
          950: '#032d29',
        },
        // Deep emerald, replacing the old blue accent outright. The product no
        // longer contains a second unrelated hue — which is most of why the
        // previous scheme read as a template.
        accent: {
          50: '#ebf4f1',
          100: '#cfe5df',
          200: '#a2ccc2',
          300: '#6dada0',
          400: '#3a8c7c',
          500: '#146e60',
          600: '#075e54',
          700: '#064e46',
          800: '#053e38',
          900: '#04302b',
        },
        // Neutrals carry a green cast rather than the usual blue-slate. This is
        // 90% of every screen, so it does more for the art direction than the
        // accent colours do.
        ink: {
          50: '#f7f8f7',
          100: '#eff2f0',
          200: '#dde4e1',
          300: '#c6d0cc',
          400: '#9aa6a2',
          500: '#687572',
          600: '#515d5a',
          700: '#3b4644',
          800: '#24302e',
          900: '#101514',
          950: '#070a09',
        },
        // Dark chromatic surfaces: the immersive closing band, operator UI, the
        // dark-mode canvas. Deliberately not folded into `ink` — #0b2421 is
        // lighter than #101514 but far more saturated, so putting it on the
        // neutral ramp would break monotonicity.
        deep: {
          500: '#124b43',
          600: '#0e3b35',
          700: '#0b2421',
          800: '#081b18',
          900: '#050f0e',
        },
      },
      // Editorial display scale. Fluid, so mobile gets its own proportions
      // without a pile of breakpoint variants. Arabic line-heights are
      // corrected in index.css — 1.08 is right for Latin caps and too tight
      // for Arabic descenders.
      fontSize: {
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.08em' }],
        'display-3': ['clamp(1.625rem, 3vw, 2.25rem)', { lineHeight: '1.25' }],
        'display-2': ['clamp(2rem, 4.6vw, 3.25rem)', { lineHeight: '1.14' }],
        'display-1': ['clamp(2.5rem, 6.2vw, 4.5rem)', { lineHeight: '1.08' }],
      },
      // Controlled, not "everything is a pill". Every step drops about one
      // notch from the Tailwind defaults, so surfaces read as precise product
      // chrome. `rounded-full` is untouched — avatars and status pills still
      // need it.
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.3125rem',
        lg: '0.375rem',
        xl: '0.5rem',
        '2xl': '0.625rem',
        '3xl': '0.75rem',
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        // Vertical rhythm for section bands.
        section: '7.5rem',
        'section-sm': '4.5rem',
      },
      maxWidth: {
        // Arabic sets wider than Latin at the same point size, so the
        // comfortable measure is shorter in characters.
        measure: '38ch',
        'measure-lg': '52ch',
        shell: '76rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        // Legacy aliases. These used to translate on the X axis, which travels
        // the wrong way under RTL. Both now resolve to the direction-neutral
        // rise so existing usages inherit correct motion rather than silently
        // losing their animation.
        'slide-in-right': 'messageIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-in-left': 'messageIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'message-in': 'messageIn 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        blink: 'blink 1s step-end infinite',
        'draw-line': 'drawLine 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'grow-bar': 'growBar 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Direction-neutral message arrival: rises and settles rather than
        // sliding sideways, so it reads identically in RTL and LTR.
        messageIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.985)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        growBar: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        swift: 'cubic-bezier(0.4, 0, 0.2, 1)',
        snappy: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      // `duration-400` has been written twice in this codebase and silently
      // did nothing, because Tailwind's scale jumps 300 -> 500.
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
      // Very subtle, tinted to the green-black rather than blue-black. `glow`
      // is a hairline ring, never a bloom.
      boxShadow: {
        soft: '0 1px 2px rgba(11, 36, 33, 0.04)',
        medium: '0 1px 3px rgba(11, 36, 33, 0.05), 0 1px 2px rgba(11, 36, 33, 0.03)',
        large: '0 4px 16px rgba(11, 36, 33, 0.06), 0 1px 3px rgba(11, 36, 33, 0.03)',
        xl: '0 10px 30px rgba(11, 36, 33, 0.07), 0 2px 8px rgba(11, 36, 33, 0.03)',
        glow: '0 0 0 1px rgba(8, 127, 115, 0.14)',
        'glow-strong': '0 0 0 1px rgba(8, 127, 115, 0.26)',
      },
    },
  },
  plugins: [],
};
