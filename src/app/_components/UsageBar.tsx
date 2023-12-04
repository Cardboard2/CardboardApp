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
    for (let i = percent; i <= newPercent && i <= 100; i++) {
      setTimeout(function () {
        updatePercent(Math.floor(i));
      }, i * 7);
    }
  }

  function decrementBar(newPercent: number) {
    for (let i = percent; i >= newPercent && i >= 0; i--) {
      setTimeout(
        function () {
          updatePercent(Math.floor(i));
        },
        (percent - i) * 100,
      );
    }
  }

  return (
    <div className=" w-full rounded-lg bg-neutral-200 dark:bg-neutral-600 dark:text-gray-200 p-1">
      <div
        className="bg-primary text-primary-100 rounded-lg bg-amber-200 dark:bg-amber-800 p-0.5 py-1.5 text-center text-sm font-medium leading-none"
        style={{ width: Math.round(percent) + "%" }}
      >
        {percent}%
      </div>
    </div>
  );
};

export default UsageBar;
