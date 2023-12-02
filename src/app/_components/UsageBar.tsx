import { useState, useEffect } from "react";

interface UsageBarInterface {
  usage: number;
  totalSpace: number;
}

const UsageBar = ({ usage, totalSpace }: UsageBarInterface) => {
  const [percent, updatePercent] = useState(0);

  useEffect(() => {
    const newPercent = (usage / totalSpace) * 100;
    updateBar(newPercent);
  }, [usage, totalSpace]);

  function updateBar(newPercent: number) {
    for (let i = 0; i < newPercent; i++) {
      setTimeout(function () {
        updatePercent(Math.round(i));
      }, i * 7);
    }
  }

  return (
    <div className="w-full rounded-md bg-neutral-200 dark:bg-neutral-600">
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
