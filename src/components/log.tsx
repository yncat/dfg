import React from "react";
import { GlobalLogic } from "../logic/global";
import { ButtonGroup } from "react-bootstrap";

const defaultRowsCount = 10;
const maxRowsCount = 100;
const minRowsCount = 10;

interface Props {
  globalLogic: GlobalLogic;
  contents: Array<string>;
}

export default function Log(props: Props) {
  const i18n = props.globalLogic.i18n;
  const [rowsCount, setRowsCount] = React.useState<number>(defaultRowsCount);

  const handleRowsCount = (instruction: "in" | "de") => {
    if (instruction === "in" && rowsCount === maxRowsCount) {
      return;
    }
    if (instruction === "de" && rowsCount === minRowsCount) {
      return;
    }
    setRowsCount((prev) => {
      const newCount = instruction === "in" ? prev + 10 : prev - 10;
      props.globalLogic.updateAutoRead(i18n.gameLog_changedRowsCount(newCount));
      return newCount;
    });
  };

  return (
    <div>
      <h2>{i18n.gameLog_heading()}</h2>
      <ul>
        {props.contents.slice(0, rowsCount).map((v, i) => {
          return <li key={i}>{v}</li>;
        })}
      </ul>
      <ButtonGroup>
        <button
          type="button"
          disabled={rowsCount === maxRowsCount}
          onClick={(evt) => {
            handleRowsCount("in");
          }}
        >
          {i18n.gameLog_increase()}
        </button>
        <button
          type="button"
          disabled={rowsCount === minRowsCount}
          onClick={(evt) => {
            handleRowsCount("de");
          }}
        >
          {i18n.gameLog_decrease()}
        </button>
      </ButtonGroup>
    </div>
  );
}
