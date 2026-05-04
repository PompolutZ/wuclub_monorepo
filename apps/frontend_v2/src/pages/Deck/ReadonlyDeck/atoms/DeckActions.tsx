import { Menu } from "@headlessui/react";
import {
  EditIcon,
  MoreVerticalIcon,
  ShareIcon,
} from "../../../../shared/components/Icons";
import {
  Copy,
  List,
  Image,
  Download,
  ExternalLink,
  Swords,
  Trash2,
} from "lucide-react";
import { useDeckContext } from "../context";
import { DeckPrivacyToggleButton } from "./DeckPrivacyToggle";
import DropdownMenu from "./DropdownMenu";
import ExportMenu from "./ExportMenu";
import { DeleteMenuButton } from "./IconButton";
import IconLink from "./IconLink";

function MobileMenu() {
  const {
    deckId,
    deck,
    isPrivate,
    toggleDeckPrivacy,
    exportToUDB,
    createShareableLink,
    onDelete,
    canUpdateOrDelete,
  } = useDeckContext();

  return (
    <DropdownMenu trigger={<MoreVerticalIcon />}>
      <div>
        {canUpdateOrDelete && (
          <Menu.Item>
            {({ active }) => (
              <IconLink
                active={active}
                to={{ pathname: `/deck/edit/${deckId}`, state: { deck } }}
                label="Edit"
              >
                <EditIcon
                  className="h-5 w-5 mr-2 stroke-current"
                  fill="#C4B5FD"
                />
              </IconLink>
            )}
          </Menu.Item>
        )}
      </div>

      <div className="flex flex-col">
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? "bg-purple-500 text-white" : "text-purple-900"
              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              onClick={createShareableLink}
            >
              <ShareIcon
                className="h-5 w-5 mr-2 stroke-current"
                fill="#C4B5FD"
              />
              <span className={`${active ? "text-white" : "text-gray-900"}`}>
                Create shareable link
              </span>
            </button>
          )}
        </Menu.Item>
      </div>

      {canUpdateOrDelete && (
        <div className="flex flex-col">
          <Menu.Item>
            {({ active }) => (
              <DeckPrivacyToggleButton
                className={`${
                  active ? "bg-purple-500 text-white" : "text-purple-900"
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                isPrivate={isPrivate}
                onClick={toggleDeckPrivacy}
              />
            )}
          </Menu.Item>
        </div>
      )}

      <ExportMenu exportToUDB={exportToUDB} />

      <div>
        {canUpdateOrDelete && (
          <Menu.Item>
            {({ active }) => (
              <DeleteMenuButton active={active} onClick={onDelete} />
            )}
          </Menu.Item>
        )}
      </div>
    </DropdownMenu>
  );
}

function DesktopMenu() {
  const {
    deckId,
    deck,
    isPrivate,
    toggleDeckPrivacy,
    cardsView,
    onCardsViewChange,
    canUpdateOrDelete,
    copyInVassalFormat,
    onDelete,
    exportToUDB,
    createShareableLink,
    onDownloadProxy,
    canSpawnRoom,
    onSpawnRoom,
    hasActiveRoom,
  } = useDeckContext();

  return (
    <>
      {canUpdateOrDelete && (
        <IconLink
          className="hover:bg-gray-200"
          to={{ pathname: `/deck/edit/${deckId}`, state: { deck } }}
          label="Edit"
        >
          <EditIcon className="h-5 w-5 mr-2 stroke-current" fill="#C4B5FD" />
        </IconLink>
      )}

      <button
        className="text-purple-700 w-24 justify-center group hover:bg-gray-200 flex rounded-md items-center px-2 py-2 text-sm"
        onClick={onCardsViewChange}
      >
        {cardsView ? (
          <>
            <List className="h-5 w-5 mr-2" fill="#C4B5FD" />
            <span className="text-gray-900">List</span>
          </>
        ) : (
          <>
            <Image className="h-5 w-5 mr-2" fill="#C4B5FD" />
            <span className="text-gray-900">Images</span>
          </>
        )}
      </button>

      {canUpdateOrDelete && (
        <DeckPrivacyToggleButton
          isPrivate={isPrivate}
          onClick={toggleDeckPrivacy}
        />
      )}

      <DropdownMenu
        className="relative z-10"
        trigger={
          <div className="flex text-purple-700 w-28 justify-center group hover:bg-gray-200 rounded-md items-center px-2 py-2 text-sm">
            <Copy className="h-5 w-5 mr-2" fill="#C4B5FD" />
            <span className="text-gray-900">Copy</span>
          </div>
        }
      >
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? "bg-purple-500 text-white" : "text-purple-900"
              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              onClick={createShareableLink}
            >
              <span className={`${active ? "text-white" : "text-gray-900"}`}>
                Shareable link
              </span>
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? "bg-purple-500 text-white" : "text-purple-900"
              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              onClick={copyInVassalFormat}
            >
              <span className={`${active ? "text-white" : "text-gray-900"}`}>
                Copy in Vassal format
              </span>
            </button>
          )}
        </Menu.Item>
      </DropdownMenu>

      <DropdownMenu
        className="relative z-10"
        trigger={
          <div className="flex text-purple-700 w-28 justify-center group hover:bg-gray-200 rounded-md items-center px-2 py-2 text-sm">
            <Download className="h-5 w-5 mr-2" fill="#C4B5FD" />
            <span className="text-gray-900">Download</span>
          </div>
        }
      >
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? "bg-purple-500 text-white" : "text-purple-900"
              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
              onClick={onDownloadProxy}
            >
              <span className={`${active ? "text-white" : "text-gray-900"}`}>
                Proxy Cards
              </span>
            </button>
          )}
        </Menu.Item>
      </DropdownMenu>

      <DropdownMenu
        className="relative z-10"
        trigger={
          <div className="flex text-purple-700 w-28 justify-center group hover:bg-gray-200 rounded-md items-center px-2 py-2 text-sm">
            <ExternalLink className="h-5 w-5 mr-2" fill="#C4B5FD" />
            <span className="text-gray-900">Export</span>
          </div>
        }
      >
        <ExportMenu exportToUDB={exportToUDB} />
      </DropdownMenu>

      {canSpawnRoom && (
        <button
          className="text-purple-700 group hover:bg-gray-200 flex rounded-md items-center px-2 py-2 text-sm"
          onClick={onSpawnRoom}
        >
          <Swords className="h-5 w-5 mr-2" />
          <span className="text-gray-900">
            {hasActiveRoom ? "Return to room" : "Spawn a new room"}
          </span>
        </button>
      )}

      {canUpdateOrDelete && (
        <button
          className="text-accent3-700 group hover:bg-gray-200 flex rounded-md items-center px-2 py-2 text-sm"
          onClick={onDelete}
        >
          <Trash2 className="h-6 w-6 mr-2" fill="#F27263" />
          <span>Delete</span>
        </button>
      )}
    </>
  );
}

export function DeckActions() {
  return (
    <>
      <div className="lg:hidden">
        <MobileMenu />
      </div>
      <div className="hidden lg:flex items-center">
        <DesktopMenu />
      </div>
    </>
  );
}
