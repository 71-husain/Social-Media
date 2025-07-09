"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { RiVideoUploadLine } from "react-icons/ri";
import { LuImagePlus } from "react-icons/lu";
import { CiHome } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { SiYoutubeshorts } from "react-icons/si";


function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (route: string) => pathname === route;

  return (
    <>
    <div className="fixed bottom-0 w-full bg-white border-t-2 border-black shadow-md z-[999] flex justify-around items-center py-2 rounded-t-md text-center lg:hidden ">
      {/* Home */}
      <Link href="/" className={isActive("/") ? "text-blue-600" : "text-black"}>
        <CiHome size={28} />
      </Link>

      <Link href="/reels" className={isActive("/reels") ? "text-blue-600" : "text-black"}>
        < SiYoutubeshorts size={28} />
      </Link>

      {session ? (
        <>
          {/* Upload Video */}
          <Link
            href="/upload"
            className={isActive("/upload") ? "text-blue-600" : "text-black"}
          >
            <RiVideoUploadLine size={28} />
          </Link>

          {/* Upload Post */}
          <Link
            href="/upload-post"
            className={isActive("/upload-post") ? "text-blue-600" : "text-black"}
          >
            <LuImagePlus size={28} />
          </Link>

        </>
      ) : (
        <>
          {/* Login */}
          <Link
            href="/login"
            className={isActive("/login") ? "text-blue-600" : "text-black"}
          >
            <FiLogIn size={28} />
          </Link>

          {/* Register */}
          <Link
            href="/register"
            className={isActive("/register") ? "text-blue-600" : "text-black"}
          >
            <FiUserPlus size={28} />
          </Link>
        </>
      )}

      {/* Profile */}
      <Link
        href="/profile"
        className={isActive("/profile") ? "text-blue-600" : "text-black"}
      >
        <CgProfile size={28} />
      </Link>
    </div>

    {/* navbar for desktop  */}
        <div className="hidden lg:flex flex-col h-screen fixed left-0 top-0 w-56 bg-white border-r px-6 py-12 text-lg shadow-md z-[999] space-y-6  ">
      {/* Home */}
      <Link href="/" className={ `flex items-center gap-3 ${isActive("/") ? "text-blue-600" : "text-black"}`}>
        <CiHome size={28} />
        Home
      </Link>

      <Link href="/reels" className={ `flex items-center gap-3  ${isActive("/reels") ? "text-blue-600" : "text-black"}`}>
        < SiYoutubeshorts size={28} />
        Reels
      </Link>

      {session ? (
        <>
          {/* Upload Video */}
          <Link
            href="/upload"
            className={ `flex items-center gap-3 ${isActive("/upload") ? "text-blue-600" : "text-black"}`}
          >
            <RiVideoUploadLine size={28} />
            Upload Video
          </Link>

          {/* Upload Post */}
          <Link
            href="/upload-post"
            className={ `flex items-center gap-3 ${isActive("/upload-post") ? "text-blue-600" : "text-black"}`}
          >
            <LuImagePlus size={28} />
            Upload Post
          </Link>

        </>
      ) : (
        <>
          {/* Login */}
          <Link
            href="/login"
            className={ `flex items-center gap-3 ${isActive("/login") ? "text-blue-600" : "text-black"}`}
          >
            <FiLogIn size={28} />
            Login
          </Link>

          {/* Register */}
          <Link
            href="/register"
            className={ `flex items-center gap-3 ${isActive("/register") ? "text-blue-600" : "text-black"}`}
          >
            <FiUserPlus size={28} />
            Register
          </Link>
        </>
      )}

      {/* Profile */}
      <Link
        href="/profile"
        className={ `flex items-center gap-3 ${isActive("/profile") ? "text-blue-600" : "text-black"}` }
      >
        <CgProfile size={28} />
        Profile
      </Link>
    </div>
    </>
  );
}

export default Header;