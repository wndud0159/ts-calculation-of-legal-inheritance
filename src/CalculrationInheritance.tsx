import React, { useState } from "react";

const CalcultationInheritance: React.VFC = () => {
  const priceRegex = /\B(?=(\d{3})+(?!\d))/g;
  const mustNumberRegex = /[^0-9]/g;
  const [price, setPrice] = useState("");

  const converterPrice = (price: string): string => {
    const result = price.replace(priceRegex, ",");
    return result;
  };

  const changePriceHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.replace(mustNumberRegex, "");
    setPrice(result);
  };
  return (
    <div className="w-full border border-red-300">
      <div>
        <label htmlFor="">총 상속액</label>
        <br />
        <input type="text" className="w-full text-right border" value={converterPrice(price)} onChange={changePriceHandler} />
      </div>
      <div className="flex items-center justify-between">
        <button className="w-5/12 py-2 border">지우기</button>
        <button className="w-6/12 py-2 border">결과보기</button>
      </div>
    </div>
  );
};

export default CalcultationInheritance;
