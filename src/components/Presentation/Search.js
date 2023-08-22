import sample from "../../assets/sample.png";
import Title from "./Title";
export default function search() {
  return (
    <div className=" relative flex h-screen   flex-1  flex-col  overflow-hidden      text-accent">
      <Title firstLine="Similarity" secondLine="Search" />
      <div className="mx-auto flex  basis-3/4 items-center ">
        <img className="max-w-xs md:max-w-lg" src={sample} alt="dots" />
      </div>
    </div>
  );
}
