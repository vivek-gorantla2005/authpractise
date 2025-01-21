import { auth } from "@/auth"; // assuming auth is NextAuth configuration exported from your auth file
import { CustomSession } from "@/auth"; // make sure to import the CustomSession type

export default async function Home() {
  // Fetch the session using the custom session type
  const session = await auth() as CustomSession;

  // Check if the session and user exist
  if (!session?.user) return null;

  // Access the custom fields like email and token
  return (
    <>
      <p>{session.user.email}</p>
      <p>{session.user.token}</p>
      <p>{session.user.name}</p>
    </>
  );
}
