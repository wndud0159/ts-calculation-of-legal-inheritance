import React, { useCallback, useEffect, useRef, useState } from "react";

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
  const [spuseValue, setSpouseValue] = useState({
    title: "사망한 분의 배우자",
    rate: "",
    value: "",
  });
  const [resultValue, setResultValue] = useState({ title: "", rate: "", value: "" });
  const [isResult, setIsResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

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
          setResultValue((prev) => ({ ...prev, title: "사망한 분의 자녀" }));
          break;
        case "parents":
          setShareValue((prev) => ({ ...prev, ...updatedValue }));
          setHeight("h-[400px]");
          setResultValue((prev) => ({ ...prev, title: "사망한 분의 부모" }));
          break;
        case "BAndS":
          setShareValue((prev) => ({ ...prev, ...updatedValue }));
          setHeight("h-[490px]");
          setResultValue((prev) => ({ ...prev, title: "사망한 분의 형제자매" }));
          break;
        case "cousin":
          setShareValue((prev) => ({ ...prev, ...updatedValue }));
          setResultValue((prev) => ({ ...prev, title: "사망한 분의 사촌 이내의 혈족" }));
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
    calculationOfLegalInheritance();
    setIsResult((prev) => true);
    resultRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const calculationOfLegalInheritance = () => {
    if (isSpouse) {
      const divisionValue = parseInt(shareValue.value) * 2 + 3;
      const spouseResult = Math.round((parseInt(price) / divisionValue) * 3);
      const etcResult = Math.round((parseInt(price) / divisionValue) * ((divisionValue - 3) / parseInt(shareValue.value)));
      setSpouseValue((prev) => ({
        ...prev,
        rate: `3/${divisionValue}`,
        value: `금 ${converterPrice(spouseResult.toString())}원`,
      }));
      setResultValue((prev) => ({
        ...prev,
        rate: `각 ${(divisionValue - 3) / parseInt(shareValue.value)}/${divisionValue}`,
        value: `각 금 ${converterPrice(etcResult.toString())}원`,
      }));
    } else {
      if (shareValue.value === "1") {
        setResultValue((prev) => ({
          ...prev,
          rate: "각 1/1",
          value: `각 금 ${converterPrice(price)}원`,
        }));
        return;
      }
      const result = Math.round(parseInt(price) / parseInt(shareValue.value));
      setResultValue((prev) => ({
        ...prev,
        rate: `각 1/${shareValue.value}`,
        value: `각 금 ${converterPrice(result.toString())}원`,
      }));
    }
  };

  const removeResultHandler = useCallback(() => {
    setPrice((prev) => "");
    setShareValue((prev) => ({ type: "", value: "" }));
    setIsSpouse((prev) => false);
    setIsResult((prev) => false);
  }, []);

  const copyClipBoardHandler = () => {
    if (isSpouse) {
      onCopy(`${spuseValue.title}  ${spuseValue.rate}  ${spuseValue.value}   ${resultValue.title}  ${resultValue.rate}  ${resultValue.value} 합계: 100%   총 ${converterPrice(price)}원`);
      return;
    }
    onCopy(`${resultValue.title}  ${resultValue.rate}  ${resultValue.value} 합계: 100%   총 ${converterPrice(price)}원`);
  };

  const onCopy = (text: string) => {
    // 흐름 1.
    if (!document.queryCommandSupported("copy")) {
      return alert("복사하기가 지원되지 않는 브라우저입니다.");
    }
    // 흐름 2.
    const textarea = document.createElement("textarea")! as HTMLTextAreaElement | any;
    textarea.value = text;
    textarea.style.top = 0;
    textarea.style.left = 0;
    textarea.style.position = "fixed";
    // 흐름 3.
    document.body.appendChild(textarea);
    // focus() -> 사파리 브라우저 서포팅
    textarea.focus();
    // select() -> 사용자가 입력한 내용을 영역을 설정할 때 필요
    textarea.select();
    // 흐름 4.
    document.execCommand("copy");
    // 흐름 5.
    document.body.removeChild(textarea);
    alert("클립보드에 복사되었습니다.");
  };

  return (
    <div className="w-full my-6">
      <div>상속분 계산</div>
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
          <div className="mb-2 font-normal not-italic">사망한 분의 배우자</div>
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
        <button onClick={removeResultHandler} className="w-1/2 py-2 rounded-lg bg-[#DDDDDD]">
          지우기
        </button>
        <button onClick={clickValidationCheckHandler} className="w-1/2 py-2 rounded-lg bg-[#08594B] text-white">
          결과보기
        </button>
      </div>
      {/* result form */}
      {isResult && (
        <div className="bg-[#FFFFFF] mx-4 p-4 mt-10 rounded-lg border border-[#08594B]">
          {isSpouse && (
            <div className=" mb-8">
              <div className="mb-2">{spuseValue.title}</div>
              <div className="flex rounded py-2 px-2.5 bg-[#F8FBFA] border border-[rgba(0,0,0,0.1)] ">
                <div className=" mr-11">{spuseValue.rate}</div>
                <div>{spuseValue.value}</div>
              </div>
            </div>
          )}

          <div className="">
            <div className="mb-2">{resultValue.title}</div>
            <div className="flex rounded py-2 px-2.5 bg-[#F8FBFA] border border-[rgba(0,0,0,0.1)] ">
              <div className=" mr-6">{resultValue.rate}</div>
              <div>{resultValue.value}</div>
            </div>
          </div>
          <div className="flex py-6">
            <div className=" mr-8">합계: 100%</div>
            <div>총 {converterPrice(price)}원</div>
          </div>
          <button onClick={copyClipBoardHandler} className=" text-[#FFFFFF] rounded-lg py-2 w-full bg-[#08594B]">
            결과 복사하기
          </button>
        </div>
      )}
      <div ref={resultRef}></div>
    </div>
  );
}
