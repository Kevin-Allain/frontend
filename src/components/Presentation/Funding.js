import dots from "../../assets/dots.png";
import Title from "./Title";

export default function funding() {
  return (
    <div className="relative flex h-screen flex-1  flex-col overflow-hidden text-accent">
      <Title firstLine="Duration" secondLine="  & Funding" />

      <p className=" font-regular text-md px-4 font-Raleway text-offWhite md:pr-[40%] md:text-xl lg:p-global lg:pr-[33%] text-justify">
        The project is an ongoing collaboration between six different
        universities across four countries, which started in Feb 2021 and is
        funded until February 2024 by the NEH/AHRC New Directions for Digital
        Scholarship in Cultural Institutions Call (see announcement <a href="https://webarchive.nationalarchives.gov.uk/ukgwa/20200619160542/https://ahrc.ukri.org/funding/apply-for-funding/current-opportunities/neh-ahrc-new-directions-for-digital-scholarship-in-cultural-institutions-call/"><u>here</u></a>) via
        the support of the Arts and Humanities Research Council (UK) and the
        National Endowment for the Humanities (USA).
      </p>
      <img
        className="absolute right-0 top-0 hidden h-screen lg:block"
        src={dots}
        alt="dots"
      />
    </div>
  );
}
