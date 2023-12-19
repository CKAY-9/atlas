import { UnitDTO } from "@/api/units/dto"
import style from "./preview.module.scss"

const UnitPreview = (props: {
  unit: UnitDTO
}) => {
  return (
    <div className={style.preview}>
      <span>{props.unit.name}</span>
    </div>
  );
}

export default UnitPreview;
