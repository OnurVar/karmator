import { useState } from 'react'
import OrderedResult from '../shared/OrderedResult'
import './AltinGunu.css'

const DEFAULT_NAME_COUNT = 10

function AltinGunu() {
  const [names, setNames] = useState<string[]>(Array(DEFAULT_NAME_COUNT).fill(''))
  const [result, setResult] = useState<string[] | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [animationResults, setAnimationResults] = useState<string[] | null>(null)
  const [bulkExpanded, setBulkExpanded] = useState(false)
  const [bulkText, setBulkText] = useState('')

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names]
    newNames[index] = value
    setNames(newNames)
  }

  const addName = () => {
    setNames([...names, ''])
  }

  const removeName = (index: number) => {
    if (names.length <= 1) return
    const newNames = names.filter((_, i) => i !== index)
    setNames(newNames)
  }

  const getValidNames = (): string[] => {
    return names
      .map(name => name.trim())
      .filter(name => name.length > 0)
  }

  const capitalizeFirst = (str: string) => {
    const trimmed = str.trim()
    if (trimmed.length === 0) return ''
    return trimmed.charAt(0).toLocaleUpperCase('tr-TR') + trimmed.slice(1)
  }

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const generateRandomResult = (validNames: string[]): string[] => {
    return shuffleArray(validNames)
  }

  const shuffle = () => {
    const validNames = getValidNames()
    if (validNames.length < 2) return

    setIsShuffling(true)
    setAnimationResults(generateRandomResult(validNames))

    let animationCount = 0
    const animationInterval = setInterval(() => {
      animationCount++

      if (animationCount >= 25) {
        clearInterval(animationInterval)
        const finalResult = generateRandomResult(validNames)
        setResult(finalResult)
        setAnimationResults(null)
        setIsShuffling(false)
      } else {
        setAnimationResults(generateRandomResult(validNames))
      }
    }, 80)
  }

  const reset = () => {
    setNames(Array(DEFAULT_NAME_COUNT).fill(''))
    setResult(null)
    setAnimationResults(null)
  }

  const applyBulkPaste = () => {
    // Support both comma-separated and line-break separated input
    const parsed = bulkText
      .split(/[,\n]/)
      .map(name => capitalizeFirst(name))
      .filter(name => name.length > 0)

    if (parsed.length > 0) {
      setNames(parsed)
      setBulkText('')
      setBulkExpanded(false)
      setResult(null)
    }
  }

  const validNameCount = getValidNames().length

  return (
    <div className="altin-gunu">
      {/* Results Section */}
      <div className="altin-gunu-results">
        <OrderedResult
          result={result}
          animationResults={animationResults}
          isShuffling={isShuffling}
          onShuffle={shuffle}
          onReset={reset}
          shuffleDisabled={validNameCount < 2}
        />
      </div>

      {/* Inputs Section */}
      <div className="altin-gunu-inputs">
        <div className="names-input-section">
          {names.map((name, index) => (
            <div key={index} className="name-row">
              <span className="name-number">{index + 1}.</span>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="İsim"
                className="name-input"
                disabled={isShuffling}
              />
              <button
                className="remove-btn"
                onClick={() => removeName(index)}
                disabled={names.length <= 1 || isShuffling}
                aria-label="İsmi kaldır"
              >
                ✕
              </button>
            </div>
          ))}

          <button className="add-btn" onClick={addName} disabled={isShuffling}>
            + Ekle
          </button>
        </div>

        <div className="bulk-paste-section">
          <button
            className="bulk-paste-header"
            onClick={() => setBulkExpanded(!bulkExpanded)}
            disabled={isShuffling}
          >
            <span className={`bulk-paste-arrow ${bulkExpanded ? 'expanded' : ''}`}>▶</span>
            Toplu Yapıştır
          </button>

          {bulkExpanded && (
            <div className="bulk-paste-content">
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="İsimleri virgül veya satır ile ayırın:&#10;Ali, Veli, Can&#10;veya&#10;Ali&#10;Veli&#10;Can"
                rows={6}
                disabled={isShuffling}
              />
              <button
                className="primary bulk-apply-btn"
                onClick={applyBulkPaste}
                disabled={bulkText.trim().length === 0 || isShuffling}
              >
                Uygula
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AltinGunu
