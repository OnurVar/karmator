import { useRef } from 'react'
import html2canvas from 'html2canvas'
import './OrderedResult.css'

interface OrderedResultProps {
  result: string[] | null
  animationResults: string[] | null
  isShuffling: boolean
  onShuffle: () => void
  onReset: () => void
  shuffleDisabled: boolean
  placeholderText?: string
}

function OrderedResult({
  result,
  animationResults,
  isShuffling,
  onShuffle,
  onReset,
  shuffleDisabled,
  placeholderText = 'Karıştırmak için butona tıklayın',
}: OrderedResultProps) {
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
          link.download = 'altin-gunu-sonuc.png'
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
    <div className="ordered-result">
      <div ref={resultRef} className={`result-section ${isShuffling ? 'shuffling' : ''}`}>
        <div className="ordered-container">
          {displayResult ? (
            <ol className="ordered-list">
              {displayResult.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ol>
          ) : (
            <div className="ordered-placeholder" />
          )}
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

export default OrderedResult
