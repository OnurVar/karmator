import { useState } from 'react'
import './PairShuffle.css'

interface ShuffleResult {
  teamA: string[]
  teamB: string[]
}

const DEFAULT_PAIRS = [
  'Ali-Veli',
  'Ayşe-Fatma',
  'Mehmet-Ahmet',
  'Zeynep-Elif',
  'Can-Deniz',
  'Ege-Arda',
  'Selin-Ceren',
]

function PairShuffle() {
  const [pairs, setPairs] = useState<string[]>(DEFAULT_PAIRS)
  const [result, setResult] = useState<ShuffleResult | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [animationResults, setAnimationResults] = useState<ShuffleResult | null>(null)

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
    setPairs(DEFAULT_PAIRS)
    setResult(null)
    setAnimationResults(null)
  }

  const displayResult = animationResults || result
  const validPairCount = parsePairs().length

  return (
    <div className="pair-shuffle">
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

      {displayResult && (
        <div className={`result-section ${isShuffling ? 'shuffling' : ''}`}>
          <div className="teams-container">
            <div className="team">
              <h3>Takım A</h3>
              <ul className="team-list">
                {displayResult.teamA.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
            <div className="team-divider" />
            <div className="team">
              <h3>Takım B</h3>
              <ul className="team-list">
                {displayResult.teamB.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PairShuffle
