import sja from "../../assets/sja.png";
import rutgers from "../../assets/logo_rutgers_white.png";
import Title from "./Title";

export default function partners() {
  return (
    <div className=" relative flex h-screen   flex-1  flex-col  overflow-hidden      text-accent">
      <Title firstLine="Partners" secondLine="" />

      <div className="flex basis-3/4 items-center justify-center self-center">
        <img
          className=" w-64 drop-shadow-md    md:w-64"
          src={sja}
          alt="person"
        />
        <img
          className=" drop-shadow-md mx-[2rem]"
          src={rutgers}
          alt="person"
          width={600}
        />
      </div>
    </div>
  );
}
