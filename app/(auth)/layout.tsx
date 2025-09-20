import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center gap-6 p-6 md:p-10 h-full justify-between">
      {/* <div className="flex w-full max-w-sm flex-col gap-6 h-full justify-between"> */}
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="text-primary-foreground flex size-10 items-center justify-center rounded-md">
          <Image
            src="/logo.svg"
            alt="K.kits"
            width={1000000}
            height={1000000}
          />
        </div>
        <span className="titre text-3xl">K.kits</span>
      </Link>

      {children}

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 w-full max-w-sm ">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
      {/* </div> */}
    </div>
  );
}
