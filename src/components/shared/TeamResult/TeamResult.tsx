import { useRef } from 'react'
import html2canvas from 'html2canvas'
import './TeamResult.css'

export interface ShuffleResult {
  teamA: string[]
  teamB: string[]
}

interface TeamResultProps {
  result: ShuffleResult | null
  animationResults: ShuffleResult | null
  isShuffling: boolean
  onShuffle: () => void
  onReset: () => void
  shuffleDisabled: boolean
  placeholderText?: string
}

function TeamResult({
  result,
  animationResults,
  isShuffling,
  onShuffle,
  onReset,
  shuffleDisabled,
  placeholderText = 'Karıştırmak için butona tıklayın',
}: TeamResultProps) {
  const resultRef = useRef<HTMLDivElement>(null)

  const saveScreenshot = async () => {
    if (!resultRef.current || !result) return

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: null,
        scale: 2,
      })

      canvas.toBlob(async (blob) => {
        if (!blob) return
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
        } catch (clipboardError) {
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

  return (
    <div className="team-result">
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
          <p className="result-placeholder-text">{placeholderText}</p>
        )}
      </div>
      {result && !isShuffling && (
        <button className="screenshot-btn" onClick={saveScreenshot}>
          📋 Kopyala
        </button>
      )}

      <div className="button-group">
        <button
          className="primary shuffle-btn"
          onClick={onShuffle}
          disabled={shuffleDisabled || isShuffling}
        >
          {isShuffling ? '🎲 Karıştırılıyor...' : '🎲 Karıştır'}
        </button>
        <button
          className="secondary"
          onClick={onReset}
          disabled={isShuffling}
        >
          Sıfırla
        </button>
      </div>
    </div>
  )
}

export default TeamResult
