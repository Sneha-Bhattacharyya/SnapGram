'use client'
import {useUser} from "@/providers/AuthProvider";

export default function Home() {

  const { user, loading } = useUser() ?? { user: null, loading: true };
  console.log(user);
  // const router = useRouter();
  if (loading) return <p>Loading user...</p>;
  if (!user)
    window.location.href = "/login";
  return (
    <div>
      <h1>Hello, {user?.username}</h1>
    </div>
  );
}