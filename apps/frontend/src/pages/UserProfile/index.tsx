import { useEffect, useState } from "react";
import AvatarPicker from "../../components/AvatarPicker";
import { generateUsername } from "./generateUsername";
import { useQueryUserData, useCreateUser, useUpdateUser } from "./queries";
import { Factions } from "@fxdxpz/schema";

function UserProfile() {
  const { data, isLoading } = useQueryUserData();
  console.log("DATA", data);
  const { mutateAsync: create } = useCreateUser();
  const { mutateAsync: update } = useUpdateUser();
  const [username, setUsername] = useState(
    data ? data.displayName : generateUsername(),
  );
  const [avatar, setAvatar] = useState(
    data ? data.avatar : "elathains-soulreapers",
  );

  const changeName = (e: any) => {
    setUsername(e.target.value);
  };

  const handleAvatarChange = (e: any) => {
    setAvatar(e);
  };

  useEffect(() => {
    if (!data) return;

    setUsername(data.displayName);
    if (data.avatar.includes("/")) {
      const [icon] = data.avatar.split("/").slice(-1);
      const a = icon.split("-icon.png")[0];
      setAvatar(a);
    } else {
      setAvatar(data.avatar);
    }
  }, [data]);

  const save = async () => {
    if (data) {
      await update({ avatar: avatar as Factions, displayName: username });
    } else {
      await create({
        displayName: username,
        avatar: avatar as Factions,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Hang on please...
      </div>
    );
  }

  return (
    <div className="flex-1 text-gray-900">
      <div className="w-full sm:w-2/4 lg:w-1/4 mx-auto p-4 space-y-4">
        <h1 className="text-xl">Your profile</h1>
        <section>
          <h2 className="mb-2">Username</h2>
          <input
            onChange={changeName}
            placeholder="Username"
            value={username}
            className="px-3 py-2 w-full border border-purple-300 focus:ring focus:ring-purple-500 focus:outline-none"
          />
        </section>

        <section>
          <h2 className="mb-2">Avatar</h2>
          <AvatarPicker
            current={avatar}
            onSelectionChange={handleAvatarChange}
          />
        </section>

        <button
          className="w-full focus:bg-purple-500 btn btn-purple mr-8 cursor-pointer hover:font-semibold px-4 py-2 font-bold"
          disabled={
            !avatar ||
            !username ||
            (data && data.displayName === username && data.avatar === avatar)
          }
          onClick={save}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
