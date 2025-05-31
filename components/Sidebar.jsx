"use client";
import React, { useCallback, useEffect, useState } from "react";
import css from "@/styles/Sidebar.module.css";
import Box from "./Box";
import { sidebarRoutes } from "@/lib/sidebar";
import Link from "next/link";
import { Typography } from "antd";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import cx from "classnames";
import { useSettingsContext } from "@/context/settings/settings-context";
import SidebarContainer from "./SidebarContainer";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  const {
    settings: { isSidebarOpen },
    setSettings,
  } = useSettingsContext();

  const handleDrawerClose = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      isSidebarOpen: false,
    }));
  }, [setSettings]);

    useEffect(() => {
    if (isSidebarOpen) {
      handleDrawerClose();
    }
  }, [pathname, handleDrawerClose]);

  const isActive = (route) => {
    if (route.route === pathname) {
      return css.active;
    }
  };
  const activeColor = (route) => {
    return isActive(route) && "var(--primary)";
  };
  return (
    <SidebarContainer
      isDrawerOpen={isSidebarOpen}
      setIsDrawerOpen={handleDrawerClose}
    >
      <div className={css.wrapper}>
        <Box className={css.container}>
          {sidebarRoutes().map((route, index) => (
            <Link
              key={index}
              href={route.route}
              className={cx(css.item, isActive(route))}
            >
              {/* icon    */}
              <Typography style={{ color: activeColor(route) }}>
                <Icon icon={route.icon} width={20} />
              </Typography>
              {/* name */}
              <Typography
                className="typoSubtitle2"
                style={{ color: activeColor(route) }}
              >
                {route.name}
              </Typography>
            </Link>
          ))}
          <Link
            href={""}
            className={css.item}
            onClick={() => {
              signOut(() => router.push("/sign-in"));
            }}
          >
            {/* icon    */}
            <Typography>
              <Icon icon={"solar:logout-2-bold"} width={"20px"} />
            </Typography>
            {/* name */}
            <Typography className="typoSubtitle2">Sign out</Typography>
          </Link>
        </Box>
      </div>
    </SidebarContainer>
  );
};

export default Sidebar;
