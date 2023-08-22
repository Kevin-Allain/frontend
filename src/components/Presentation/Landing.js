import bg_land from "../../assets/landCompressed.png";
import { BsMusicNote } from "react-icons/bs";
// type Props = {
//   onClick: () => void;
// };
export default function landing(
    props
    // : Props
) {
    return (
        <div className="  ">
            <div className="absolute">
                <img
                    className=" bot-0  h-[90dvh] w-screen object-cover object-bottom"
                    src={bg_land}
                />
            </div>
            <div className="  w-sceen relative  flex    h-[100dvh] flex-col  justify-center  px-4  pb-28 lg:px-global ">
                <h2 className="font-Raleway text-4xl  font-medium text-accent md:text-6xl lg:text-7xl">
                    Welcome to
                </h2>
                <h1 className="-my-2  font-Raleway   text-7xl font-black  text-offWhite md:-my-4 md:text-[10.5rem] lg:-my-6 lg:text-[13.5rem] 2xl:text-[14.5rem] ">
                    JAZZDAP
                </h1>
                <p className=" max-w-xs font-Raleway  text-sm  font-light  text-offWhite md:max-w-sm md:text-[1.3]   lg:max-w-md lg:text-xl ">
                    New Directions in Digital Jazz Studies: Music Information Retrieval
                    and AI Support for Jazz Scholarship in Digital Archives.
                </p>{" "}
                {/* <a className=" mt-2 flex max-w-fit flex-row items-center gap-1 rounded-sm bg-primary px-4  py-2 text-center text-offWhite"></a> */}
                <button
                    onClick={props.onClick}
                    className=" h- text-md  group relative mt-2    h-10  w-44 overflow-hidden rounded-lg bg-primary  shadow-sm  md:h-12 md:w-48 md:text-lg"
                >
                    <div className="absolute inset-0 w-3  bg-accent transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                    <span className="relative  flex items-center  justify-center text-offWhite group-hover:text-white ">
                        <BsMusicNote /> Similarity Search
                    </span>
                </button>
            </div>
        </div>
    );
}
