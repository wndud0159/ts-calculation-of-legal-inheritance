import React, { useCallback, useEffect, useState } from "react";

type InitialData = {
  type: string;
  value: string;
};

export default function InheritanceCalculration() {
  const [height, setHeight] = useState("h-[580px]");
  /**
   * base 580
   * children 310
   * parents 400
   * brother and sister 490
   */

  // const [firstClick, setFirstClick] = useState(false)
  const priceRegex = /\B(?=(\d{3})+(?!\d))/g;
  const mustNumberRegex = /[^0-9]/g;
  const [price, setPrice] = useState("");
  const [isSpouse, setIsSpouse] = useState(false);
  const [shareValue, setShareValue] = useState<InitialData>({ type: "", value: "" });
  // const [resultPrice, setResultPrice] = useState('')

  useEffect(() => {
    if (isSpouse) {
      if (shareValue.type === "BAndS" || shareValue.type === "cousin") {
        setShareValue({ type: "", value: "" });
      }
      if (shareValue.type === "children") {
        setHeight("h-[310px]");
        return;
      }
      setHeight("h-[400px]");
    } else {
      if (shareValue.type === "children" || shareValue.type === "parents" || shareValue.type === "BAndS") {
        return;
      }
      setHeight("h-[580px]");
    }
  }, [isSpouse, shareValue]);

  const converterPrice = (price: string): string => {
    const result = price.replace(priceRegex, ",");
    return result;
  };

  const changePriceHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = e.target.value.replace(mustNumberRegex, "");
    setPrice(result);
  };
  const changeFamilyHandler = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const result = e.target.value.replace(mustNumberRegex, "");
    let updatedValue: InitialData = {
      type: type,
      value: result,
    };
    switchFamilyHandler(updatedValue);
  };

  const switchFamilyHandler = useCallback(
    (updatedValue: InitialData) => {
      if (!updatedValue.value) {
        updatedValue.type = "";
        setShareValue((prev) => updatedValue);
        setHeight("h-[580px]");
        return;
      }

      switch (updatedValue.type) {
        case "children":
          setShareValue((prev) => ({ ...prev, ...updatedValue }));
          setHeight("h-[310px]");
          break;
        case "parents":
          setShareValue((prev) => ({ ...prev, ...updatedValue }));
          setHeight("h-[400px]");
          break;
        case "BAndS":
          setShareValue((prev) => ({ ...prev, ...updatedValue }));
          setHeight("h-[490px]");
          break;
        case "cousin":
          setShareValue((prev) => ({ ...prev, ...updatedValue }));
          break;
      }
    },
    [setHeight, setShareValue]
  );

  const yesIsSpouseHandler = () => {
    // setFirstClick(true)
    setIsSpouse((prev) => true);
  };

  const noIsSpouseHandler = () => {
    // setFirstClick(true)
    setIsSpouse((prev) => false);
  };

  const clickValidationCheckHandler = () => {
    if (!price) {
      alert("총 상속액은 필수로 입력해야 합니다.");
      return;
    }
    if (!shareValue.value) {
      alert("상속인은 적어도 1명 이상의 상속인을 입력해야 합니다.");
      return;
    }
    console.log("click");
    calculationOfLegalInheritance();
  };

  const calculationOfLegalInheritance = () => {
    if (isSpouse) {
      const divisionValue = parseInt(shareValue.value) * 2 + 3;
      const spouseResult = Math.round((parseInt(price) / divisionValue) * 3);
      const etcResult = Math.round((parseInt(price) / divisionValue) * ((divisionValue - 3) / parseInt(shareValue.value)));
      console.log("배우자 가질 돈", spouseResult);
      console.log("나머지 나눈거", etcResult);
    } else {
      if (shareValue.value === "1") {
        // setResultPrice(price)
        return;
      }
      const result = Math.round(parseInt(price) / parseInt(shareValue.value));
      console.log(result);
    }
  };

  return (
    <div className="w-full my-6">
      <div> 상속계산</div>
      <div className={`px-4 py-4 bg-[#FFFFFF] mx-4 rounded-lg overflow-hidden transition-all ${height}`}>
        <div>
          <div className="mb-2">총 상속액</div>
          <div className="relative flex items-center justify-center">
            <input type="text" className="w-full text-right border border-zinc-200 outline-none focus:border-[#08594B] py-2 px-8 rounded-[4px]" value={converterPrice(price)} onChange={changePriceHandler} />
            <span className=" absolute right-4 ">원</span>
          </div>
        </div>
        <div className="py-4">상속인</div>
        <div className="text-sm">
          <div className="mb-2 font-normal not-italic">사망한분의 배우자</div>
          <div className="flex items-center justify-between space-x-2">
            <button onClick={noIsSpouseHandler} className={`${!isSpouse ? "border-[#08594B] text-black-900" : "border-[rgba(0,0,0,0.1)] text-zinc-400"} w-1/2 py-2 rounded-lg border`}>
              없음
            </button>
            <button onClick={yesIsSpouseHandler} className={`${isSpouse ? "border-[#08594B] text-black-900" : "border-[rgba(0,0,0,0.1)] text-zinc-400"} w-1/2 py-2 rounded-lg border `}>
              있음
            </button>
          </div>
        </div>
        <div>
          <div className="mb-2 mt-4 text-sm">1. 사망한 분의 자녀</div>
          <div className="relative flex items-center justify-center">
            <input
              value={shareValue.type === "children" ? shareValue.value : ""}
              onChange={(e) => {
                changeFamilyHandler(e, "children");
              }}
              type="text"
              className="w-full text-right border border-zinc-200 outline-none focus:border-[#08594B] py-2 px-8 rounded-[4px]"
            />
            <span className=" absolute right-4 ">명</span>
          </div>
        </div>
        <div>
          <div className="mb-2 mt-4 text-sm">2. 사망한 분의 부모</div>
          <div className="relative flex items-center justify-center">
            <input
              value={shareValue.type === "parents" ? shareValue.value : ""}
              onChange={(e) => {
                changeFamilyHandler(e, "parents");
              }}
              type="text"
              className="w-full text-right border border-zinc-200 outline-none focus:border-[#08594B] py-2 px-8 rounded-[4px]"
            />
            <span className=" absolute right-4 ">명</span>
          </div>
        </div>
        <div>
          <div className="mb-2 mt-4 text-sm">3. 사망한 분의 형제자매</div>
          <div className="relative flex items-center justify-center">
            <input
              value={shareValue.type === "BAndS" ? shareValue.value : ""}
              onChange={(e) => {
                changeFamilyHandler(e, "BAndS");
              }}
              type="text"
              className="w-full text-right border border-zinc-200 outline-none focus:border-[#08594B] py-2 px-8 rounded-[4px]"
            />
            <span className=" absolute right-4 ">명</span>
          </div>
        </div>
        <div>
          <div className="mb-2 mt-4 text-sm">4. 사망한 분의 사촌 이내의 혈족</div>
          <div className="relative flex items-center justify-center">
            <input
              value={shareValue.type === "cousin" ? shareValue.value : ""}
              onChange={(e) => {
                changeFamilyHandler(e, "cousin");
              }}
              type="text"
              className="w-full text-right border border-zinc-200 outline-none focus:border-[#08594B] py-2 px-8 rounded-[4px]"
            />
            <span className=" absolute right-4 ">명</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 mt-6 space-x-2">
        <button className="w-1/2 py-2 rounded-lg bg-[#DDDDDD]">지우기</button>
        <button onClick={clickValidationCheckHandler} className="w-1/2 py-2 rounded-lg bg-[#08594B] text-white">
          결과보기
        </button>
      </div>
      {/* result form */}
      <div className="bg-[#FFFFFF] mx-4 p-4 mt-10 rounded-lg border border-[#08594B]">
        <div className=" mb-8">
          <div className="mb-2">1. 사망한 분의 배우자</div>
          <div className="flex rounded py-2 px-2.5 bg-[#F8FBFA] border border-[rgba(0,0,0,0.1)] ">
            <div className=" mr-11">3/7</div>
            <div>금 42,857,143원</div>
          </div>
        </div>
        <div className="">
          <div className="mb-2">2. 사망한 분의 자녀</div>
          <div className="flex rounded py-2 px-2.5 bg-[#F8FBFA] border border-[rgba(0,0,0,0.1)] ">
            <div className=" mr-6">각 3/7</div>
            <div>금 28,571,429원</div>
          </div>
        </div>
        <div className="flex py-6">
          <div className=" mr-8">합계: 100%</div>
          <div>총 100,000,000원</div>
        </div>
        <button className=" text-[#FFFFFF] rounded-lg py-2 w-full bg-[#08594B]">결과 복사하기</button>
      </div>
    </div>
  );
}
