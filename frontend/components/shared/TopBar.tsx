"use client"
import React from 'react';
import Link from "next/link";
import {Button} from '../ui/button';
import {useUser} from "@/providers/AuthProvider";
import Image from "next/image";
import {useRouter} from "next/navigation";

const TopBar = () => {
    const userContext = useUser();
    const user = userContext?.user ?? null;
    const router = useRouter();

    function signOut() {
        localStorage.removeItem("accessToken");
        router.push("/login");
    }

    return (
        <section className="sticky top-0 z-50 md:hidden bg-dark-2 w-full">
            <div className="flex-between py-4 px-5">
                <Link href="/" className="flex gap-3 items-center">
                    <Image
                        src="/images/logo.svg"
                        alt="logo"
                        width={130}
                        height={325}
                    />
                </Link>

                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        className="shad-button_ghost"
                        onClick={() => signOut()}>
                        <Image src="/icons/logout.svg" alt="logout" width={30} height={30}/>
                    </Button>
                    <Link href={`/profile/${user?.id}`} className="flex-center gap-3">
                        <Image
                            src={"/icons/profile-placeholder.svg"}
                            alt="profile"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full"
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TopBar;