import { useEffect, useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import MusicInfo from "./MusicInfo"
import SampleRes from './SampleRes';
import {
    addAnnotation,
    updateAnnotation,
    getAnnotations,
    deleteAnnotation,
    doesMp3exist
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

    const sja_id = text.split('-')[0]+'_'+text.split('-')[1].replace('T','');
    console.log("sja_id: ",sja_id);
    const [mp3Exists, setMp3Exists] = useState(null);

    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 20;

    const handleNextRange = () => {
        if ((startIndex + itemsPerPage) <= listSearchRes.length) setStartIndex(startIndex + itemsPerPage);
    };

    const handlePrevRange = () => {
        setStartIndex(Math.max(0, startIndex - itemsPerPage));
    };

    const currentItems = listSearchRes.slice(startIndex, startIndex + itemsPerPage);
    console.log("currentItems: ",currentItems);

    // TODO work in progress to force loading of this info prior to call the SampleRes
    useEffect(() => {
      console.log("in useEffect, sja_id: ",sja_id);
      const fetchData = async () => {
        try {
          const result = await doesMp3exist(sja_id, setMp3Exists);
          // setMp3Exists(result);
          console.log("result: ",result,", mp3Exists: ",mp3Exists);
        } catch (error) {
          console.error('Error fetching data:', error);
          setMp3Exists(false); // Set mp3Exists to false in case of an error
        }
      };
  
      fetchData();
    }, [sja_id,mp3Exists]);
  

    return (
      <div className="trackres" key={text + "_" + listSearchRes.length}>
        {/* <div className="texttrackres"> <h3>Track: {text} </h3> </div> */}
        {/* <div className='iconTracksInteractions'> <AnnotationSystem type={"track"} info={text} /> 
        <EmbeddedWorkflowInteraction idCaller={listSearchRes[0].arrIdNotes[0]} typeCaller={"track"} /> </div> */}
        {testPerformances ? (
          <></>
        ) : (
          <>
            {listSearchRes.length} matches. <br />
            {listSearchRes.length > itemsPerPage && (
              <div className="pagination-buttons flex">
                <IoIosArrowBack
                  className="icon"
                  onClick={handlePrevRange}
                  disabled={startIndex === 0}
                />{" "}
                | {startIndex}-
                {Math.min(listSearchRes.length, startIndex + itemsPerPage)} |
                <IoIosArrowForward
                  className="icon"
                  onClick={handleNextRange}
                  disabled={startIndex + itemsPerPage >= listSearchRes.length}
                />
              </div>
            )}
            {mp3Exists === null ? (
              <p>Loading...</p>
            ) : (
              <div>
                {currentItems.map((item, i) => (
                  <div className="border-4 border-solid rounded">
                    <div className="text-left mx-[1rem] my-[0.25rem] ">
                      Match {startIndex + i}{" "}
                    </div>
                    <SampleRes
                      text={i + "-" + item.track}
                      lognumber={item.track.split("-")[0]}
                      length={
                        item.arrTime[item.arrTime.length - 1] +
                        item.arrDurations[item.arrDurations.length - 1] -
                        item.arrTime[0]
                      }
                      notes={item.arrNotes.toString().replaceAll(",", "-")}
                      durations={item.arrDurations
                        .toString()
                        .replaceAll(",", "-")}
                      times={item.arrTime.toString().replaceAll(",", "-")}
                      distance={item.distCalc}
                      // addition
                      idDBNotes={item.arrIdNotes}
                      // Need to format the structure
                      funcPlayMIDI={() => formatAndPlay(item)}
                      mp3Exists={mp3Exists}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
}

export default TrackRes