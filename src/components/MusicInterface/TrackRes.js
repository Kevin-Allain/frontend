import { useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import MusicInfo from "./MusicInfo"
import SampleRes from './SampleRes';
import {
    addAnnotation,
    updateAnnotation,
    getAnnotations,
    deleteAnnotation
} from "../../utils/HandleApi";
import AnnotationSystem from '../Annotation/AnnotationSystem';
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io'

const TrackRes = ({
    text,
    // lognumber, // length, // notes, // durations, // times, // distance, // funcPlayMIDI,  // getMusicInfo, 
    infoMusicList,
    // addAnnotation, // getAnnotations, // updateAnnotation, // deleteAnnotation, 
    listSearchRes,
    formatAndPlay,
    getMusicInfo,
    setInfoMusicList,
    testPerformances = false
}) => {
    console.log("TrackRes - ",{ text, infoMusicList, listSearchRes, formatAndPlay, getMusicInfo, setInfoMusicList, testPerformances     })

    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 20;

    const handleNextRange = () => {
        if ((startIndex + itemsPerPage) <= listSearchRes.length) setStartIndex(startIndex + itemsPerPage);
    };

    const handlePrevRange = () => {
        setStartIndex(Math.max(0, startIndex - itemsPerPage));
    };

    const currentItems = listSearchRes.slice(startIndex, startIndex + itemsPerPage);



    return (
      <div className="trackres" key={text}>
        {/* <div className="texttrackres"> <h3>Track: {text} </h3> </div> */}
        {/* <div className='iconTracksInteractions'> <AnnotationSystem type={"track"} info={text} /> <EmbeddedWorkflowInteraction idCaller={listSearchRes[0].arrIdNotes[0]} typeCaller={"track"} /> </div> */}
        {testPerformances ? (
          <></>
        ) : (
          <>
            {listSearchRes.length} samples. <br />
            { listSearchRes.length > itemsPerPage &&
            <div className="pagination-buttons flex">
                <IoIosArrowBack className='icon' onClick={handlePrevRange} disabled={startIndex === 0}/> | {startIndex}-{Math.min(listSearchRes.length,startIndex + itemsPerPage)} |
                {/* Previous</button> */}
                <IoIosArrowForward className='icon' onClick={handleNextRange} disabled={(startIndex + itemsPerPage) >= listSearchRes.length}/>
                {/* Next</button> */}
            </div>
            }
            {currentItems.map((item, i) => (
              <div className="border-4 border-solid rounded">
                <div className="text-left mx-[1rem] my-[0.25rem] ">
                  Sample {startIndex+i}{" "}
                </div>
                {/* {item.track}  */}
                <SampleRes
                  // key={i + '' + item.recording + '_' + item.arrNotes.toString().replaceAll(',', '-')}
                  text={i + "-" + item.track}
                  lognumber={item.track.split("-")[0]}
                  length={
                    item.arrTime[item.arrTime.length - 1] +
                    item.arrDurations[item.arrDurations.length - 1] -
                    item.arrTime[0]
                  }
                  notes={item.arrNotes.toString().replaceAll(",", "-")}
                  durations={item.arrDurations.toString().replaceAll(",", "-")}
                  times={item.arrTime.toString().replaceAll(",", "-")}
                  distance={item.distCalc}
                  // addition
                  idDBNotes={item.arrIdNotes}
                  // Need to format the structure
                  funcPlayMIDI={() => formatAndPlay(item)}
                  // getMusicInfo={() => getMusicInfo(item.recording, infoMusicList, setInfoMusicList)}
                  // infoMusicList={infoMusicList}
                />
              </div>
            ))}

          </>
        )}
      </div>
    );
}

export default TrackRes