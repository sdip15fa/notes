import { useEffect, useState } from "react";

const Expire = (props:any) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, props.delay);
  }, [props.delay]);

  return visible ? <div>{props.children}</div> : <div />;
};

export default Expire;