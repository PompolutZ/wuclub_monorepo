import { Menu } from "@headlessui/react";

interface ExportMenuProps {
  exportToUDB: () => void;
}

const ExportMenu = ({ exportToUDB }: ExportMenuProps) => {
  return (
    <div className="flex flex-col">
      <Menu.Item>
        {({ active }) => (
          <button
            className={`${
              active ? "bg-purple-500 text-white" : "text-gray-900"
            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
            onClick={exportToUDB}
          >
            <img
              className="w-5 h-5 mr-2"
              alt="UnderworldsDB logo"
              src="https://www.underworldsdb.com/favicon.ico"
              width="16"
              height="16"
            />
            Open on UnderworldsDB
          </button>
        )}
      </Menu.Item>
    </div>
  );
};

export default ExportMenu;
