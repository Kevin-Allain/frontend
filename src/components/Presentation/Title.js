// type  Props = {
//     firstLine  : string;
//     secondLine : string;
//   };

  export default function title(props
    // : Props
    ) {
    return (
      <div>
        <div className=" left-0 top-0	 flex basis-1/4   flex-col justify-center p-4 text-4xl md:text-6xl lg:p-global ">
          <h3 className=" font-Raleway  font-bold text-offWhite">
            {props.firstLine}
          </h3>
          <h3 className=" font-Raleway  font-bold text-accent">
            {props.secondLine}
          </h3>
        </div>
      </div>
    );
  }
  