import { PlusIcon } from "@heroicons/react/20/solid";

export default function CircularButton() {
  return (
    <button
      type="button"
      className="rounded-full bg-amber-600 p-2 text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
    >
      <PlusIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
