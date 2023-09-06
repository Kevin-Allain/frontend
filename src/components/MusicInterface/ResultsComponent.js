import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {useInView} from 'react-intersection-observer'
import { MdKeyboardDoubleArrowUp, MdKeyboardDoubleArrowLeft, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { AiOutlineLoading } from 'react-icons/ai';
import TrackRes from './TrackRes'; // You should adjust the import path


const ResultsComponent = ({
  listLogNumbers,
  lognumbersRefs,
  scrollToButtonListLogsNumbers,
  findMatchRecording,
  infoMusicList,
  listTracks,
  scrollToButtonListRecordingsFollowing,
  scrollToButtonListTracksFollowing,
  listSearchRes,
  formatAndPlay,
  getMusicInfo,
  setInfoMusicList,
  testPerformances=false
}) => {
  
  // const [visibleTracks, setVisibleTracks] = useState([]);
  const [visibleTracks, setVisibleTracks] = useState({});
  const tracksContainerRef = useRef(null);

  // TODO update based on indexes of visible elements. (and consider clicks with buttons!)
  const [indexBegObserver, setIndexBegObserver] = useState(0); 
  const [indexEndObserver, setIndexEndObserver] = useState(10);

  const [showComponent, setShowComponent] = useState(false);


  const LazyLoadedTrack = ({ track, ndx }) => {
    // Add your track rendering logic here
    // if(ndx===0){console.log("Loaded lazy. Info is: ",{track,ndx,listSearchRes,formatAndPlay,getMusicInfo,infoMusicList,setInfoMusicList})}
    {/* Track content */ }
    return (
      // Test render. Better to work with the Trackres directly.
      // <div className='trackItem' id={track}> Track to display (should call TrackRes I guess) Index is {ndx}. </div>
      <TrackRes key={'Track' + ndx + '' + track} text={track}
      listSearchRes={listSearchRes.filter((a) => a.recording === track)}
      formatAndPlay={formatAndPlay} getMusicInfo={getMusicInfo} infoMusicList={infoMusicList} setInfoMusicList={setInfoMusicList}
      testPerformances={true} />
    );
  };
  

  useEffect(() => {
    console.log("======== useEffect ResultsComponent");


    // ---- New approach
    // Actually working fine...?! It wasn't working before.
    let tracksQuerySelection = document.querySelectorAll(".trackItem");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const trackId = entry.target.id;
        const track = trackId;
        // const addDivId = "additionalDiv-" + trackId;
        // const addDiv = document.getElementById(addDivId);
        const addTrackResId = "additionalTrackRes-" + trackId;
        const addTrackRes = document.getElementById(addTrackResId);

        if (entry.isIntersecting) {
        // if (!addDiv) {
        //   const newDiv = document.createElement("div");
        //   newDiv.id = addDivId;
        //   newDiv.textContent = "Test addition for entry " + trackId;
        //   entry.target.appendChild(newDiv);
        if (!addTrackRes) {
          // Create a new TrackRes component
            // const newTrackRes = <TrackRes key={'Track'+ track} text={track}
            // listSearchRes={listSearchRes.filter((a) => a.recording === track)}
            // formatAndPlay={formatAndPlay} getMusicInfo={getMusicInfo} infoMusicList={infoMusicList} setInfoMusicList={setInfoMusicList}
            // testPerformances={true} />;
            // ReactDOM.render(newTrackRes, document.getElementById(trackId));            
            setShowComponent(true);
          }
          observer.unobserve(entry.target);

          setVisibleTracks(prev => ({ ...prev, 
            [entry.target.dataset.track]: true }));
        } else {
          // Remove the div if it exists and is out of view
          // if (addDiv) { entry.target.removeChild(addDiv); }
          // if (addTrackRes) { ReactDOM.unmountComponentAtNode(entry.target); }
          // if (addTrackRes) { entry.target.removeChild(addTrackRes); }
          setShowComponent(false);

          setVisibleTracks(prev => ({ ...prev,
            [entry.target.dataset.track]: false }));
        }
      })
    }, { threshold: 0.25 }
    );

    // tracksQuerySelection.forEach(t => observer.observe(t));
    const trackItems = document.querySelectorAll('.trackItem');
    trackItems.forEach(item => observer.observe(item));

    return () => {
      trackItems.forEach(item => observer.unobserve(item));
    };
  }, [listTracks,indexBegObserver]);

  return (
    testPerformances ? <></> :
      <div className='resultsComponent' ref={tracksContainerRef}>
        {listLogNumbers.length > 0 &&
          listLogNumbers.map((lln, index) => (
            <div
              className='recordingItem'
              key={'recordingItem' + index}
              alt={lln}
              ref={(ref) => (lognumbersRefs.current[index] = ref)}
            >
              <h2>Recording: {lln}</h2>
              <em> List of recordings{' '} <MdKeyboardDoubleArrowUp className='icon' onClick={scrollToButtonListLogsNumbers} /> </em>
              <div className='metadataRecording'>
                {infoMusicList.length === 0 ? (
                  <AiOutlineLoading className='spin' size={'20px'} />
                ) : findMatchRecording(lln) !== -1 ? (
                  <div className='detailResultMeta'>
                    {/* Content to display if the index matches <p>lognumber: {lln}</p> */}
                    {/* Add more properties from the matched object here */}
                    {/* From item: {infoMusicList[findMatchRecording(lln)].lognumber} */}
                    {/* TODO prettify (set different div and make it nicer) */}
                    <u>Info about recording:</u>
                    {Object.entries(infoMusicList[findMatchRecording(lln)]).map(([key, value]) => (
                      <p key={key}> {key}: {value} </p>
                    ))}

                  </div>
                ) : (
                  <>No match for metadata</>
                )}
              </div>
              <div className='matchedTracksOfRecording'>
                {listTracks.length > 0 &&
                  listTracks.map((track, ndx) => {
                    if (track.includes(lln)) {
                      return (
                        <> 
                        {/* A MATCH with {track} and {lln} */}
                          <div
                            className='trackItem'
                            id={track}
                            key={track}
                            data-track={track}
                            style={{
                              // visibility: visibleTracks.includes(track) ? 'visible' : 'hidden', color: 'red'
                            }}
                          >
                            Previous Recording{' '}<MdKeyboardDoubleArrowLeft className='icon' onClick={(e) => scrollToButtonListRecordingsFollowing(e, lln, 'prev')} />
                            | Previous Track{' '}
                            <MdOutlineKeyboardArrowLeft className='icon' onClick={(e) => scrollToButtonListTracksFollowing(e, ndx, track, 'prev')} />
                            | Next Track{' '}
                            <MdOutlineKeyboardArrowRight className='icon' onClick={(e) => scrollToButtonListTracksFollowing(e, ndx, track, 'next')} />
                            | Next Recording
                            <MdKeyboardDoubleArrowRight className='icon' onClick={(e) => scrollToButtonListRecordingsFollowing(e, lln, 'next')} />
                            {/* This is the one element that results in too many elements for good performances... */}
                            {/* <TrackRes key={'Track' + ndx + '' + track} text={track} listSearchRes={listSearchRes.filter( (a) => a.recording === track )}
                          formatAndPlay={formatAndPlay} getMusicInfo={getMusicInfo} infoMusicList={infoMusicList} setInfoMusicList={setInfoMusicList}
                          testPerformances={true} /> */}

                            {/* Render only the visible tracks */}
                            {/* <LazyLoadedTrack track={track} ndx={ndx} /> */}

                            {/* Render based on intersection of observer */}
                            {/* size={window.innerHeight / 10} */}
                            {/* {(!showComponent) &&  <AiOutlineLoading className="spin"/> } */}
                            {/* {showComponent && 
                              <TrackRes key={'Track' + ndx + '' + track} text={track} listSearchRes={listSearchRes.filter((a) => a.recording === track)}
                              formatAndPlay={formatAndPlay} getMusicInfo={getMusicInfo} infoMusicList={infoMusicList} setInfoMusicList={setInfoMusicList}
                              testPerformances={false} />} */}
                          </div>
                            {(!visibleTracks[track]) &&  <AiOutlineLoading className="spin"/> }
                            {visibleTracks[track] && (
                              <TrackRes key={'Track' + ndx + '' + track} text={track} listSearchRes={listSearchRes.filter((a) => a.recording === track)}
                              formatAndPlay={formatAndPlay} getMusicInfo={getMusicInfo} infoMusicList={infoMusicList} setInfoMusicList={setInfoMusicList}
                              testPerformances={false} />
                            )}
                        </>
                      );
                    } else {
                      return null; // or any fallback if track doesn't match
                    }
                  })
                }
              </div>
            </div>
          ))}
      </div>
  );
}

export default ResultsComponent;
