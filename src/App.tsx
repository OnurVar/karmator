import "./App.css";

import { useState } from "react";

import PairShuffle from "./components/PairShuffle";
import ClassicShuffle from "./components/ClassicShuffle";
import AltinGunu from "./components/AltinGunu";

type TabType = "pair" | "classic" | "altin-gunu";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("pair");

  return (
    <div className="container">
      <h1>Karmatör</h1>

      <div className="tabs tabs--three">
        <div
          className="tab-indicator"
          style={{
            transform: `translateX(${
              activeTab === "pair" ? "0%" : activeTab === "classic" ? "100%" : "200%"
            })`,
          }}
        />
        <button
          className={`tab ${activeTab === "pair" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("pair")}
        >
          İkili Karıştır
        </button>
        <button
          className={`tab ${activeTab === "classic" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("classic")}
        >
          Klasik Karıştır
        </button>
        <button
          className={`tab ${activeTab === "altin-gunu" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("altin-gunu")}
        >
          Altın Günü
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "pair" && (
          <div className="tab-panel">
            <PairShuffle />
          </div>
        )}
        {activeTab === "classic" && (
          <div className="tab-panel">
            <ClassicShuffle />
          </div>
        )}
        {activeTab === "altin-gunu" && (
          <div className="tab-panel">
            <AltinGunu />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
