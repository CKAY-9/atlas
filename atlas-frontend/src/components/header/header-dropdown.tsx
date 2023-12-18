"use client"

import { useState } from "react";
import style from "./header.module.scss";
import Link from "next/link";
import Image from "next/image";

export interface HeaderDropdownProps {
  children: any,
  id: string,

} 

const HeaderDropdown = (props: HeaderDropdownProps) => {
  const [show_menu, setShowMenu] = useState<boolean>(false);

  return (
    <>
      <div id={"show_menu_" + props.id} className={style.show_menu} onMouseLeave={() => {
        setShowMenu(false);
      }}>
        <button onMouseEnter={() => setShowMenu(true)} className="minimal" id={"show_button_" + props.id}>
          <Image 
            src="/icons/add.svg"
            alt="Add"
            sizes="100%"
            width={0}
            height={0}
            className={style.nav_icon}
          />
        </button>
        <div id={"show_content" + props.id} className={style.show_content} style={{"display": show_menu ? "flex" : "none"}}>
          {props.children}
        </div>
      </div>

    </>
  );
}

export default HeaderDropdown;
