import dots from "../../assets/dots.png";
import Title from "./Title";
export default function about() {
  return (
    <div className=" relative flex h-screen   flex-1  flex-col  overflow-hidden      text-accent">
      <Title firstLine="About the" secondLine="Project" />
      <div className="basis-3/4  p-4   text-sm text-offWhite md:columns-2  md:text-lg  lg:p-global lg:pr-[33%] lg:text-xl ">
        <p className=" font-regular font-Raleway ">
          <p className=" font-Raleway  font-bold">
            A NEH-AHRC New Directions for Digital Scholarship in Cultural
            Institutions project
          </p>
          <br></br>
          New Directions in Digital Jazz Studies uses state of the art music
          information retrieval and artificial intelligence algorithms for the
          analysis of jazz recordings and linked data to enable novel approaches
          to co-creative use of materials in the archival collections of the
          Institute of Jazz Studies and Scottish Jazz Archive.
          <br></br> <br></br>
        </p>
        <p className=" font-regular font-Raleway  ">
          This trans-Atlantic collaboration between jazz historians,
          technologists, and jazz archivists will expand access to unique
          materials held in archives and illuminate their musical relationships
          to more widely studied recordings. This project will create, analyse,
          and visualize relationships between audio and other materials and
          create rich research work knows to be shared within the scholarly
          community as a novel way to support co-creation with cultural
          institutions. We envision a disciplinary transformation through the
          discovery of new models for jazz historiography, and a broader,
          interdisciplinary transformation in methodology for digital
          humanities.
        </p>
      </div>
      <img
        className="absolute right-0 top-0 hidden h-screen   lg:block"
        src={dots}
        alt="dots"
      />
    </div>
  );
}
