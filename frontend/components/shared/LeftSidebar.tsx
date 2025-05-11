'use client'

import Link from 'next/link';
import React from 'react';
import Loader from './Loader';
import {useUser} from "@/providers/AuthProvider";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {sidebarLinks} from "@/constants";
import {INavLink} from "@/types";
import {usePathname} from "next/navigation";

const LeftSidebar = () => {
    const {user, loading} = useUser() ?? {user: null, loading: true};
    const pathname = usePathname();

    function handleSignOut(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    }

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
                <Link href="/" className="flex gap-3 items-center">
                    <Image
                        src="/images/logo.svg"
                        alt="logo"
                        width={170}
                        height={36}
                    />
                </Link>

                {loading || !user?.email ? (
                    <div className="h-14">
                        <Loader/>
                    </div>
                ) : (
                    <Link href={`/profile/${user.id}`} className="flex gap-3 items-center">
                        <Image
                            src={"/icons/profile-placeholder.svg"}
                            alt="profile"
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-full"
                        />
                        <div className="flex flex-col">
                            <p className="body-bold">{user.name}</p>
                            <p className="small-regular text-light-3">@{user.username}</p>
                        </div>
                    </Link>
                )}

                <ul className="flex flex-col gap-6">
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route;

                        return (
                            <li
                                key={link.label}
                                className={`leftsidebar-link group ${
                                    isActive && "bg-primary-500"
                                }`}>
                                <Link
                                    href={link.route}
                                    className="flex gap-4 items-center p-4">
                                    <Image
                                        src={link.imgURL}
                                        alt={link.label}
                                        width={24}
                                        height={24}
                                        className={`group-hover:invert-white ${
                                            isActive && "invert-white"
                                        }`}
                                    />
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <Button
                variant="ghost"
                className="shad-button_ghost"
                onClick={(e) => handleSignOut(e)}>
                <Image src="/icons/logout.svg" alt="logout" width={24} height={24}/>
                <p className="small-medium lg:base-medium">Logout</p>
            </Button>
        </nav>
    );
};

export default LeftSidebar;