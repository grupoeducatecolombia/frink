// src/app/config/chart-theme.ts
export const theme = {
  colors: {
    primary: '#4ECDC4',
    secondary: '#FF6B6B',
    accent: '#FFE66D',
    background: 'from-blue-50 to-indigo-100',
    card: 'white',
    text: {
      primary: 'text-gray-800',
      secondary: 'text-gray-600',
      light: 'text-gray-500'
    }
  },
  chart: {
    colors: ['#4ECDC4', '#FF6B6B', '#FFE66D'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0
      }
    },
    stroke: {
      width: [2, 3, 2],
      curve: 'smooth'
    },
    markers: {
      size: [4, 5, 4],
      hover: {
        size: 7
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => val.toFixed(1)
      }
    }
  },
  buttons: {
    base: 'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md',
    active: 'bg-blue-600 text-white',
    inactive: 'bg-gray-200 text-gray-700'
  },
  cards: {
    container: 'bg-white rounded-lg shadow-lg p-6 mb-6',
    title: 'text-lg font-bold text-gray-800 mb-4 text-center'
  }
};