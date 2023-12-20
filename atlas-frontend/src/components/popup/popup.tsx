import style from "./popup.module.scss";
import Image from "next/image";

export interface PopupProps {
  children: any,
  close: any
}

const Popup = (props: PopupProps) => {
  return (
    <div className={style.popup}>
      <div className={style.content}>
        <button className={style.close} onClick={props.close}>
          <Image
            src="/icons/close.svg"
            alt="Close"
            sizes="100%"
            width={36}
            height={36}
            style={{"filter": "invert(1)"}}
          />
        </button>
        {props.children}
      </div>
    </div>
  );
}

export default Popup;
