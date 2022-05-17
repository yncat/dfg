import React from "react";
import "./autoRead.css";
import { GlobalLogic } from "../logic/global";
import { AutoReadLogic } from "../logic/autoRead";

interface Props {
  globalLogic: GlobalLogic;
  autoReadLogic: AutoReadLogic;
}

export default function AutoRead(props: Props) {
  const [message, setMessage] = React.useState<string>("");
  // Ask AutoReadLogic to call setMessage whenever a new message is dispatched. Unsubscribe when the component unmounts.
  React.useEffect(() => {
    props.autoReadLogic.subscribe(setMessage);
    return () => {
      props.autoReadLogic.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="auto-read" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
