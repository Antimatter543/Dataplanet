import GlobeTmpl from "react-globe.gl";

const Globe = ({ forwardRef, ...otherProps }) => (
  <GlobeTmpl {...otherProps} ref={forwardRef} />
);

export default Globe;