'use client'

import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { 
  atomDark, 
  dracula, 
  nightOwl, 
  oneDark, 
  solarizedlight, 
  tomorrow,
  vscDarkPlus
} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

interface PrismComponentProps {
  code: string
  language?: string
  theme?: 'atomDark' | 'dracula' | 'github' | 'nightOwl' | 'oneDark' | 'solarizedlight' | 'tomorrow' | 'vscDarkPlus'
  showLineNumbers?: boolean
  startingLineNumber?: number
  wrapLongLines?: boolean
  customStyle?: React.CSSProperties
  className?: string
}

const themes = {
  atomDark,
  dracula,
  github,
  nightOwl,
  oneDark,
  solarizedlight,
  tomorrow,
  vscDarkPlus
}

export default function PrismComponent({
  code,
  language = 'javascript',
  theme = 'oneDark',
  showLineNumbers = true,
  startingLineNumber = 1,
  wrapLongLines = false,
  customStyle = {},
  className = ''
}: PrismComponentProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const selectedTheme = themes[theme]

  return (
    <div className={`relative group ${className}`}>
      {/* Language badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="px-2 py-1 text-xs font-medium bg-black/50 text-white rounded-md backdrop-blur-sm">
          {language}
        </span>
      </div>

      {/* Copy button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 hover:bg-black/70 text-white"
        onClick={copyToClipboard}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      {/* Code highlighter */}
      <SyntaxHighlighter
        language={language}
        style={selectedTheme}
        showLineNumbers={showLineNumbers}
        startingLineNumber={startingLineNumber}
        wrapLongLines={wrapLongLines}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          ...customStyle
        }}
        className="!bg-transparent"
      >
        {code}
      </SyntaxHighlighter>

      {/* Copy feedback */}
      {copied && (
        <div className="absolute top-2 right-12 z-10">
          <span className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded-md">
            Copied!
          </span>
        </div>
      )}
    </div>
  )
}