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
    <div>
      {props.dashboardProps.fileDetail == defaultFileDetail ? (
        <></>
      ) : (
        <ul className="mt-8 space-y-5 px-7 text-lg">
          <li>
            <h2>Name</h2>
            <p>{props.dashboardProps.fileDetail.name}</p>
          </li>
          <li>
            <h2>Type</h2>
            <p>{props.dashboardProps.fileDetail.type}</p>
          </li>
          <li>
            <h2>Size</h2>
            <p>{DataSizeConversion(props.dashboardProps.fileDetail.size)}</p>
          </li>
          <li>
            <h2>Created date</h2>
            <p>{convertDateTime(props.dashboardProps.fileDetail.createdAt)}</p>
          </li>
          <li>
            <h2>Last modified</h2>
            <p>{convertDateTime(props.dashboardProps.fileDetail.modifiedAt)}</p>
          </li>
        </ul>
      )}
    </div>
  );
}
