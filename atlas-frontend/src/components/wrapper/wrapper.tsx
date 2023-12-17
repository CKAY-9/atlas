"use client"

import Header from "../header/header";
import NavigationBar from "../navigation-bar/nav-bar";
import style from "./wrapper.module.scss";

export interface WrapperProps {
  user: any | null,
  current_classroom: any | null,
  current_assignment: any | null,
}

const AtlasWrapper = ({children}: any, props: WrapperProps): JSX.Element => {
  return (
    <main className={style.wrapper}>
      <Header />
      <div className={style.wrapper_container}>
        <NavigationBar />
        <div className="container">
          {children} 
        </div>
      </div>
    </main>
  );
}

AtlasWrapper.defaultProps = {
  user: null,
  current_classroom: null,
  current_assignment: null
}

export default AtlasWrapper;
