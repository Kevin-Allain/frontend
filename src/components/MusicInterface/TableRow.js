import React, { useRef } from 'react';
import {BsFillInfoCircleFill} from 'react-icons/bs'
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { MdPiano } from "react-icons/md";
import { FiPlayCircle } from 'react-icons/fi'
import { FaMusic } from "react-icons/fa";
import { BiHide } from "react-icons/bi";
import MIDItoNote from "./MIDItoNote.json"

// should set a function for previous index that reacted, so we can change that one too when interacting
const TableRow = React.memo(({ item, index, showDetails, setShowDetails, prevSelectedIndex, setPrevSelectedIndex }) => {
  const showDetailsRef = useRef(null);
  const showPianoRollRef = useRef(null);



//   const [showDetails, setShowDetails] = useState(new Array(aggregateMatch.length).fill(false));
//   const [showPianoRoll, setShowPianoRoll] = useState(new Array(aggregateMatch.length).fill(false));

const handleClickShowDetails = () => {
    setShowDetails(prevShowDetails => {
      const newShowDetails = [...prevShowDetails];
      // Toggle showDetails for the current row
      newShowDetails[index] = !newShowDetails[index];
      // Toggle showDetails for the previously selected row (if it exists)
      if (prevSelectedIndex !== null && prevSelectedIndex !== index) {
        newShowDetails[prevSelectedIndex] = !newShowDetails[prevSelectedIndex];
      }
      // Update the index of the previously selected row
      setPrevSelectedIndex(index === prevSelectedIndex ? null : index);
      return newShowDetails;
    });
  };

  const handleClickShowPianoRoll = () => {
    // Handle show piano roll logic
  };
  const handleClickPlayMp3 = (a) => {
    console.log("handleClickPlayMp3 - a: ",a);
    // TODO
  }


    return (
        <tr key={index}>
            <td>{item['(N) Named Artist(s)']}</td>
            <td>{item['(E) Event Name']}</td>
            <td>{item['Track Title']}</td>
            <td>{item['Release Year']}</td>
            <td>{item.arrNotes
                .map((a, i) => MIDItoNote[a].replaceAll("s", ""))
                .toString().replaceAll(",", "-")}
            </td>
            <td> TODO for Details
                {showDetails[index]
                    ? <FaAngleUp className="icon" onClick={() => handleClickShowDetails(index)} />
                    : <FaAngleDown className="icon" onClick={() => handleClickShowDetails(index)} />
                }
            </td>
            <td> TODO set function to toggle piano roll
                {/* {showPianoRoll[index]
                    ? <BiHide className="icon" onClick={() => handleClickShowPianoRoll(index)} />
                    : <MdPiano className="icon" onClick={() => handleClickShowPianoRoll(index)} />
                } */}
            </td>
            <td className="icon" onClick={() => handleClickPlayMp3(item['Audio Filename (Internal backup)'])} > <FaMusic /> </td>
            <td className="icon"><FiPlayCircle /></td>
        </tr>
    );
});

export default TableRow;
