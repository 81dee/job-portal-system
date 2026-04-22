import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <ClipLoader color="blue" size={50} />
    </div>
  );
}   