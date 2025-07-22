import { UserPreview } from "@/types";
import Link from "next/link";
import { Button } from "../ui";

const UserCard = ({ user }: {user: UserPreview}) => {
  return (
    <Link href={`/profile/${user.id}`} className="user-card">
      <img
        src={user.dp_url || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;