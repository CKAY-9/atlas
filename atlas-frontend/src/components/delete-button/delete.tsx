"use client"

import Image from "next/image";
import style from "./delete.module.scss";

const DeleteButton = (props: {
  on_click: any,
  text: string
}) => {
  return (
    <button onClick={props.on_click} className={style.delete_button}>
      <Image 
        src="/icons/delete.svg"
        alt="Delete"
        sizes="100%"
        width={0}
        height={0}
      />
      <span>{props.text}</span>
    </button>
  );
}

DeleteButton.defaultProps = {
  on_click: () => {},
  text: "Delete"
}

export default DeleteButton;
