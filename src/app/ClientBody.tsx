"use client";

// Provider simple sin NextAuth
// Puedes agregar otros providers aquí en el futuro si los necesitas

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// "use client";

// import { useEffect } from "react";
// import { SessionProvider } from "next-auth/react";

// export default function ClientBody({children}: { children: React.ReactNode;}) {
//   useEffect(() => {
//     document.body.className = "antialiased";
//   }, []);

//     return <SessionProvider>{children}</SessionProvider>;

// }