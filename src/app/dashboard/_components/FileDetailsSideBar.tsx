import { DashboardProps } from "./DashboardProps";
import { defaultFileDetail } from "./FileDetail";

// export interface FileDetail {
//     objectType: string
//     name: string
//     type?: string
//     size?: number
//     createdAt?: Date
//     modifiedAt?: Date
//     id: string
// };

const SIZE_KILO = 1024;
const SIZE_MEGA = 1048576;
const SIZE_GIGA = 1073741824;

function DataSizeConversion(size: number | undefined) {
  if (size == undefined) return "Undefined";

  if (size > SIZE_GIGA)
    return String(Math.round((size / SIZE_GIGA) * 100) / 100) + " GB";
  else if (size > SIZE_MEGA)
    return String(Math.round((size / SIZE_MEGA) * 100) / 100) + " MB";
  else if (size > SIZE_KILO)
    return String(Math.round((size / SIZE_KILO) * 100) / 100) + " KB";
  else return String(size) + " B";
}

function convertDateTime(date: Date | undefined) {
  if (date !== null && date !== undefined) {
    return date.toLocaleString();
  } else {
    return "";
  }
}

export function FileDetailsSideBar(props: { dashboardProps: DashboardProps }) {
  return (
    <div className="w-full h-full overflow-y-auto">
      {props.dashboardProps.fileDetail == defaultFileDetail ? (
        <></>
      ) : (
        <ul className="pt-8 space-y-5 px-7 text-lg w-full h-full">
          <li>
            <h2 className="text-sm font-bold text-gray-700 py-2">Name</h2>
            <textarea className="w-full h-20 py-2 px-5 bg-amber-300 rounded-2xl shadow-sm border-2 border-amber-800 resize-none" disabled value={props.dashboardProps.fileDetail.name}/>
          </li>
          <li>
            <h2 className="text-sm font-bold text-gray-700 py-2">Type</h2>
            <textarea className="w-full h-20 py-2 px-5 bg-amber-300 rounded-2xl shadow-sm border-2 border-amber-800 resize-none" disabled value={props.dashboardProps.fileDetail.type}/>
          </li>
          <li>
            <h2 className="text-sm font-bold text-gray-700 py-2">Size</h2>
            <textarea className="w-full h-12 py-2 px-5 bg-amber-300 rounded-2xl shadow-sm border-2 border-amber-800 resize-none" disabled value={DataSizeConversion(props.dashboardProps.fileDetail.size)}/>
          </li>
          <li>
            <h2 className="text-sm font-bold text-gray-700 py-2">Created date</h2>
            <textarea className="w-full h-12 py-2 px-5 bg-amber-300 rounded-2xl shadow-sm border-2 border-amber-800 resize-none" disabled value={convertDateTime(props.dashboardProps.fileDetail.createdAt)}/>
          </li>
          <li>
            <h2 className="text-sm font-bold text-gray-700 py-2">Last modified</h2>
            <textarea className="w-full h-12 py-2 px-5 bg-amber-300 rounded-2xl shadow-sm border-2 border-amber-800 resize-none" disabled value={convertDateTime(props.dashboardProps.fileDetail.modifiedAt)}/>
          </li>
        </ul>
      )}
    </div>
  );
}
