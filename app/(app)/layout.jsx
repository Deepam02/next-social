import Box from "@/components/Box";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { SettingsContextProvider } from "@/context/settings/settings-provider";
import ThemeProvider from "@/lib/ThemeProvider";
import css from '@/styles/homeLayout.module.css'
import React from "react";

const HomeLayout = ({ children }) => {
  return (
    <SettingsContextProvider>
      <ThemeProvider>
        <Box 
         type="baseBg"
         style={{
          position:"relative",
          width:"100vh",
          height:"100vh",
         }}
        >

          <div className={css.wrapper}>
            {/* header  */}
            <Header/>

            <div className={css.container}>
              <Sidebar/>
              <div className={css.page_body}>
                {children}
              </div>
            </div>
          </div>
        </Box>
      </ThemeProvider>
    </SettingsContextProvider>
  );
};

export default HomeLayout;
