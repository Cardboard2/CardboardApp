interface StatisticBoxInterface {
  title: string;
  statistic: string | number;
  children?: JSX.Element;
}

const StatisticBox = ({
  title,
  statistic,
  children,
}: StatisticBoxInterface) => {
  return (
    <div
      key={"stat-" + title + "-" + statistic}
      className="flex items-baseline justify-between gap-x-4 gap-y-2 border-gray-900/5 md:flex-wrap md:border-l md:px-8"
    >
      <dt className="text-sm font-medium leading-6 text-gray-500">{title}</dt>

      <dd className="flex-none text-lg font-medium leading-10 tracking-tight text-gray-900 md:w-full md:text-2xl lg:text-3xl">
        {statistic}
      </dd>
      {children}
    </div>
  );
};

export default StatisticBox;
