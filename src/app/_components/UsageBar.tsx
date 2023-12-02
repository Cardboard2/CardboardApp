import { useState, useEffect } from "react";

interface UsageBarInterface {
  usage: number;
  totalSpace: number;
}

const UsageBar = ({ usage, totalSpace }: UsageBarInterface) => {
  const [percent, updatePercent] = useState(0);

  useEffect(() => {
    const newPercent = (usage / totalSpace) * 100;
    if (newPercent > percent) {
      incrementBar(newPercent);
    } else {
      decrementBar(newPercent);
    }
  }, [usage, totalSpace]);

  function incrementBar(newPercent: number) {
    for (let i = percent; i <= newPercent; i++) {
      setTimeout(function () {
        updatePercent(Math.floor(i));
      }, i * 7);
    }
  }

  function decrementBar(newPercent: number) {
    console.log("new %: " + newPercent);
    console.log("og %: " + percent);
    for (let i = percent; i >= newPercent; i--) {
      setTimeout(
        function () {
          updatePercent(Math.floor(i));
        },
        (percent - i) * 100,
      );
    }
  }

  return (
    <div className=" w-full rounded-md bg-neutral-200 dark:bg-neutral-600">
      <div
        className="bg-primary text-primary-100 rounded-md bg-amber-400 p-0.5 text-center text-xs font-medium leading-none"
        style={{ width: Math.round(percent) + "%" }}
      >
        {percent}%
      </div>
    </div>
  );
};

export default UsageBar;
