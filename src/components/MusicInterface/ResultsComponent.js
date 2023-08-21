import React, { useRef, useEffect, useState } from 'react';
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
  
  const [visibleTracks, setVisibleTracks] = useState([]);
  const tracksContainerRef = useRef(null);

  // TODO update based on indexes of visible elements. (and consider clicks with buttons!)
  const [indexBegObserver, setIndexBegObserver] = useState(0); 
  const [indexEndObserver, setIndexEndObserver] = useState(10);

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
    let tracksIdsInRange = Array.from(document.getElementsByClassName('trackItem'))
      .filter((a, ndx) => indexBegObserver + ndx < indexEndObserver)
      .map(a => a.id);
    console.log("tracksIdsInRange: ",tracksIdsInRange,", indexBegObserver: ",indexBegObserver,", indexEndObserver: ",indexEndObserver,", visibleTracks: ",visibleTracks);

    const observer = new IntersectionObserver((entries) => {
      console.log('trackElementsDocument[0]: ', trackElementsDocument[0], ", trackElementsDocument.length: ", trackElementsDocument.length,", entries: ", entries,", #: ", entries.length);
      let entriesId = entries.map(a => a.target.id); console.log("entriesId: ",entriesId);

      let entriesVisibility = {};
      let indexesObservers = [];
      let countEntriesListed = 0;
      entries.forEach((entry, index) => {
        const track = entry.target.getAttribute('data-track');
        const isVisible = entry.isIntersecting;
        // Set CSS visibility based on intersection
        // TODO later: draw content, rather than just change css
        if (isVisible) { entry.target.style.visibility = 'visible'; }
        else { entry.target.style.visibility = 'hidden'; }
        entriesVisibility[entry.target.id] = entry.isIntersecting;
        indexesObservers.push(index);
        console.log('Track:', track, 'Is Visible:', isVisible);
        countEntriesListed++;
      });
      console.log('entriesVisibility: ', entriesVisibility,", indexesObservers: ", indexesObservers,", countEntriesListed: ",countEntriesListed);

      // start loading from middle (direction to consider later, start loading down)
      // cases to consider:
      // - beginning of track items
      // - end of track items
      // - middle of tracks
      let indexOfIndexIntersect = tracksIdsInRange.indexOf(entriesId[0]);
      console.log("}}} indexOfIndexIntersect: ", indexOfIndexIntersect, ", entriesId: ", entriesId, ", tracksIdsInRange: ", tracksIdsInRange);
      if (entriesId.length === 1) {
        // almost certainly wrong approach...
        if (indexOfIndexIntersect === 5) {
          console.log("Changing attributes for selection of tracks");
          setIndexBegObserver(indexBegObserver + 5); setIndexEndObserver(indexEndObserver + 5);
        }
      }

      // Other console logs...      
      const newVisibleTracks = entries.map((entry) => ({
        track: entry.target.getAttribute('data-track'),
        isVisible: entry.isIntersecting,
      }));
      setVisibleTracks(newVisibleTracks);
    });

    // Actually working fine...?! It wasn't working before.
    let tracksQuerySelection = document.querySelectorAll(".trackItem")
    console.log("tracksQuerySelection: ",tracksQuerySelection,", tracksQuerySelection.length: ",tracksQuerySelection.length);
    let trackElementsDocument =
      Array.from(document.getElementsByClassName('trackItem'))
        .filter((a, ndx) => indexBegObserver+ndx < indexEndObserver); // For test. Will need to change it to another way based on... which elements are visible

    console.log("selection of trackElementsDocument: ", trackElementsDocument,
      ", indexBegObserver: ", indexBegObserver,
      ", indexEndObserver: ", indexEndObserver);

    trackElementsDocument.forEach((element) => {
      observer.observe(element);
    });

    // Clean up the observer when the component is unmounted
    return () => {
      trackElementsDocument.forEach((element) => {
        observer.unobserve(element);
      });
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
                  <div>
                    {/* Content to display if the index matches
                  <p>lognumber: {lln}</p> */}
                    {/* Add more properties from the matched object here */}
                    {/* From item: {infoMusicList[findMatchRecording(lln)].lognumber} */}
                    {/* TODO prettify (set different div and make it nicer) */}
                    <u>Info from item:</u>
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
                        // <div className='trackItem' id={track} key={track}>
                        <> A MATCH with {track} and {lln}
                          <div
                            className='trackItem'
                            id={track}
                            key={track}
                            data-track={track}
                            style={{
                              visibility: visibleTracks.includes(track) ? 'visible' : 'hidden',
                              color: 'red'
                            }}
                          >
                            Previous Recording{' '}
                            <MdKeyboardDoubleArrowLeft className='icon' onClick={(e) => scrollToButtonListRecordingsFollowing(e, lln, 'prev')} />
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
                            <LazyLoadedTrack track={track} ndx={ndx} />
                          </div>
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
