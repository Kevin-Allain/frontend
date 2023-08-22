import sja from "../../assets/sja.png";
import Title from "./Title";

export default function partners() {
  return (
    <div className=" relative flex h-screen   flex-1  flex-col  overflow-hidden      text-accent">
      <Title firstLine="Our" secondLine="Partners" />

      <div className="flex basis-3/4 items-center justify-center self-center">
        <img
          className=" w-64 drop-shadow-md    md:w-96"
          src={sja}
          alt="person"
        />
      </div>
    </div>
  );
}
