import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import './PairShuffle.css'

interface ShuffleResult {
  teamA: string[]
  teamB: string[]
}

const DEFAULT_PAIR_COUNT = 7

function PairShuffle() {
  const [pairs, setPairs] = useState<string[]>(Array(DEFAULT_PAIR_COUNT).fill(''))
  const [result, setResult] = useState<ShuffleResult | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [animationResults, setAnimationResults] = useState<ShuffleResult | null>(null)
  const [bulkExpanded, setBulkExpanded] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  const handlePairChange = (index: number, value: string) => {
    const newPairs = [...pairs]
    newPairs[index] = value
    setPairs(newPairs)
  }

  const addPair = () => {
    setPairs([...pairs, ''])
  }

  const removePair = (index: number) => {
    if (pairs.length <= 1) return
    const newPairs = pairs.filter((_, i) => i !== index)
    setPairs(newPairs)
  }

  const parsePairs = (): { left: string; right: string }[] => {
    return pairs
      .map(pair => {
        const parts = pair.split('-').map(p => p.trim())
        if (parts.length === 2 && parts[0] && parts[1]) {
          return { left: parts[0], right: parts[1] }
        }
        return null
      })
      .filter((p): p is { left: string; right: string } => p !== null)
  }

  const generateRandomResult = (validPairs: { left: string; right: string }[]): ShuffleResult => {
    const teamA: string[] = []
    const teamB: string[] = []

    validPairs.forEach(pair => {
      if (Math.random() < 0.5) {
        teamA.push(pair.left)
        teamB.push(pair.right)
      } else {
        teamA.push(pair.right)
        teamB.push(pair.left)
      }
    })

    return { teamA, teamB }
  }

  const shuffle = () => {
    const validPairs = parsePairs()
    if (validPairs.length === 0) return

    setIsShuffling(true)
    // Start animation immediately with first random result
    setAnimationResults(generateRandomResult(validPairs))

    // Animation: show random results rapidly
    let animationCount = 0
    const animationInterval = setInterval(() => {
      animationCount++

      if (animationCount >= 15) {
        clearInterval(animationInterval)
        const finalResult = generateRandomResult(validPairs)
        setResult(finalResult)
        setAnimationResults(null)
        setIsShuffling(false)
      } else {
        setAnimationResults(generateRandomResult(validPairs))
      }
    }, 80)
  }

  const reset = () => {
    setPairs(Array(DEFAULT_PAIR_COUNT).fill(''))
    setResult(null)
    setAnimationResults(null)
  }

  const capitalizeFirst = (str: string) => {
    const trimmed = str.trim()
    if (trimmed.length === 0) return ''
    return trimmed.charAt(0).toLocaleUpperCase('tr-TR') + trimmed.slice(1)
  }

  const normalizePairLine = (line: string) => {
    // Split by hyphen (with optional spaces around it)
    const parts = line.split(/\s*-\s*/)
    if (parts.length >= 2) {
      const name1 = capitalizeFirst(parts[0])
      const name2 = capitalizeFirst(parts[1])
      if (name1 && name2) {
        return `${name1} - ${name2}`
      }
    }
    // Return original if can't parse
    return line.trim()
  }

  const applyBulkPaste = () => {
    const lines = bulkText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(normalizePairLine)

    if (lines.length > 0) {
      setPairs(lines)
      setBulkText('')
      setBulkExpanded(false)
      setResult(null)
    }
  }

  const saveScreenshot = async () => {
    if (!resultRef.current || !result) return

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: null,
        scale: 2,
      })

      // Convert canvas to blob and copy to clipboard
      canvas.toBlob(async (blob) => {
        if (!blob) return
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
        } catch (clipboardError) {
          // Fallback to download if clipboard fails
          console.error('Clipboard failed, downloading instead:', clipboardError)
          const link = document.createElement('a')
          link.download = 'karmator-sonuc.png'
          link.href = canvas.toDataURL('image/png')
          link.click()
        }
      }, 'image/png')
    } catch (error) {
      console.error('Screenshot failed:', error)
    }
  }

  const displayResult = animationResults || result
  const validPairCount = parsePairs().length

  return (
    <div className="pair-shuffle">
      {/* Results Section */}
      <div className="pair-shuffle-results">
        <div ref={resultRef} className={`result-section ${isShuffling ? 'shuffling' : ''}`}>
          <div className="teams-container">
            <div className="team">
              <h3>Takım A</h3>
              {displayResult ? (
                <ul className="team-list">
                  {displayResult.teamA.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              ) : (
                <div className="team-placeholder" />
              )}
            </div>
            <div className="team-divider" />
            <div className="team">
              <h3>Takım B</h3>
              {displayResult ? (
                <ul className="team-list">
                  {displayResult.teamB.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              ) : (
                <div className="team-placeholder" />
              )}
            </div>
          </div>
          {!displayResult && (
            <p className="result-placeholder-text">Karıştırmak için butona tıklayın</p>
          )}
        </div>
        {result && !isShuffling && (
          <button className="screenshot-btn" onClick={saveScreenshot}>
            📋 Kopyala
          </button>
        )}

        {/* Action Buttons */}
        <div className="button-group">
          <button
            className="primary shuffle-btn"
            onClick={shuffle}
            disabled={validPairCount === 0 || isShuffling}
          >
            {isShuffling ? '🎲 Karıştırılıyor...' : '🎲 Karıştır'}
          </button>
          <button
            className="secondary"
            onClick={reset}
            disabled={isShuffling}
          >
            Sıfırla
          </button>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="pair-shuffle-inputs">
        <div className="pairs-input-section">
          {pairs.map((pair, index) => (
            <div key={index} className="pair-row">
              <span className="pair-number">{index + 1}.</span>
              <input
                type="text"
                value={pair}
                onChange={(e) => handlePairChange(index, e.target.value)}
                placeholder="İsim1-İsim2"
                className="pair-input"
                disabled={isShuffling}
              />
              <button
                className="remove-btn"
                onClick={() => removePair(index)}
                disabled={pairs.length <= 1 || isShuffling}
                aria-label="Çifti kaldır"
              >
                ✕
              </button>
            </div>
          ))}

          <button className="add-btn" onClick={addPair} disabled={isShuffling}>
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
                placeholder="Her satıra bir çift yazın:&#10;Ali-Veli&#10;Can-Deniz&#10;Ayşe-Fatma"
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

export default PairShuffle
