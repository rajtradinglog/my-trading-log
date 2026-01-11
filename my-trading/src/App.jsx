import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";
import TradingHeader from "./components/Tradingheader";
import TradeJournalForm from "./components/TradeJournalForm";
import ViewData from "./components/ViewData";

function App() {
  const [trader, setTrader] = useState("RAJMOHAN");

  return (
    <BrowserRouter>
    <div className="total-container">
      <TradingHeader onUserChange={setTrader} />
      <main>
        <Routes>
          <Route path="/" element={<TradeJournalForm trader={trader} />} />
          <Route path="/view-data" element={<ViewData traderState={trader} />} />
        </Routes>
      </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
