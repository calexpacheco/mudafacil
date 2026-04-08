import type { Preview } from '@storybook/react'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: 'mudafacil',
      values: [
        { name: 'mudafacil', value: '#F8FAFC' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
  },
}

export default preview
