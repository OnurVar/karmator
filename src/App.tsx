import { useState } from 'react'
import './App.css'
import PairShuffle from './components/PairShuffle'

type TabType = 'pair' | 'classic'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pair')

  return (
    <div className="container">
      <h1>Karmator</h1>

      <div className="tabs">
        <div
          className="tab-indicator"
          style={{ transform: `translateX(${activeTab === 'pair' ? '0%' : '100%'})` }}
        />
        <button
          className={`tab ${activeTab === 'pair' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('pair')}
        >
          İkili Karıştır
        </button>
        <button
          className={`tab ${activeTab === 'classic' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('classic')}
        >
          Klasik Karıştır
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'pair' ? (
          <div className="tab-panel">
            <PairShuffle />
          </div>
        ) : (
          <div className="tab-panel">
            <p>Klasik karıştırma modu (yakında)</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
