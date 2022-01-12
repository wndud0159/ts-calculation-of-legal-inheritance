import React, { useState } from "react";
import CalcultationInheritance from "./CalculrationInheritance";

function App() {
  return (
    <div className="flex flex-col items-center justify-center border">
      <div className="main bg-gray-100 flex flex-col items-center justify-center w-full px-3 h-screen">
        <div>mainPage</div>

        <CalcultationInheritance />
      </div>
    </div>
  );
}

export default App;
