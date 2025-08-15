import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Coins, User, Settings, LogOut, Users, History } from "lucide-react-native";
import clsx from "clsx";
// import { useTranslations } from "next-intl";
import { IUser } from "@/interfaces";

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  noAnimate?: boolean;
};

export default function ProfileDropdown({ user }:{user:IUser}) {
  const [show, setShow] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();
//   const tran = useTranslations();

  useEffect(() => {
    setShow(false);
  }, [router]);

  const translatedCredits = `${user.credits} Credits`;

  const menuItems: MenuItem[] = [
    {
      icon: <Coins size={16} />,
      label: "Credits",
      className: "text-muted-foreground",
      href: "/platform/settings?tab=subscription",
      onClick: () => setShow(false),
    },
    {
      icon: <User size={16} />,
      label: "Profile",
      href: `/profile/${user.id}`,
      onClick: () => setShow(false),
    },
    // {
    //   icon: <History size={16} />,
    //   label: "dxp0baapjwt",
    //   href: `/platform/watch-history`,
    //   onClick: () => setShow(false),
    // },
    {
      icon: <Settings size={16} />,
      label: "Settings",
      href: "/platform/settings",
      onClick: () => setShow(false),
    },
    // {
    //   icon: <Users size={16} />,
    //   label: "ejp4c6d7wx",
    //   href: `/platform/following`,
    //   onClick: () => setShow(false),
    // },
    {
      icon: <LogOut size={16} />,
      label: "Log Out",
      onClick: () => {
        setShowLogout(true);
        setShow(false);
      },
      className: "text-red-600",
    },
  ];

  return (
    <View className="relative">
      <TouchableOpacity onPress={() => setShow(!show)} className="flex items-center">
        {user.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            
            className="object-cover rounded-full w-8 h-8"
          />
        ) : (
          <View className="flex rounded-full w-8 h-8 items-center justify-center bg-blue dark:bg-gray-800 text-gray-600 dark:text-gray-300 ring-2 ring-primary/10">
            <Text className="text-white">{user.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
        )}
      </TouchableOpacity>

      {show && (
        <ScrollView className="absolute top-14 w-64 z-20 rounded-xl bg-white dark:bg-dark p-3">
          <View className="flex items-center gap-3 border-b border-b-slate-300 pb-3 dark:border-neutral-800">
            {user.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="object-cover"
              />
            ) : (
              <View className="flex items-center justify-center bg-blue w-8 h-8 rounded-full font-medium text-lg">
                <Text className="text-white">{user.name?.[0]?.toUpperCase() || '?'}</Text>
              </View>
            )}
            <View className="flex flex-col overflow-hidden">
              <Text className="text-base font-medium truncate dark:text-gray-100">{user.name || "Kaan"}</Text>
              <Text className="text-sm text-muted-foreground truncate">{user.email || "Email"}</Text>
            </View>
          </View>

          <View className="mt-3 flex flex-col gap-1 ">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (item.href) {
                    router.push(item.href);
                  }
                  if (item.onClick) {
                    item.onClick();
                  }
                }}
                className={clsx(
                  "flex flex-row w-full items-center gap-2 rounded-xl px-2 py-2.5 text-sm",
                  item.className
                )}
              >
                {item.icon}
                <Text>
                  {item.label === "TRANSLATED_CREDITS" ? translatedCredits : item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* {showLogout && <LogOut onsetShow={setShowLogout} />} */}
    </View>
  );
}
