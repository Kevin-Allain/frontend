import React, { useRef, useEffect, useState } from 'react';
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

  const LazyLoadedTrack = ({ track, ndx }) => {
    // Add your track rendering logic here
    if(ndx===0){console.log("Loaded lazy. Info is: ",{track,ndx,listSearchRes,formatAndPlay,getMusicInfo,infoMusicList,setInfoMusicList})}
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
  

  // useEffect(() => {
  //   console.log("listTracks in useEffect: ", listTracks,", tracksContainerRef: ",tracksContainerRef);
  //   const observer = new IntersectionObserver((entries) => {
  //     const newVisibleTracks = entries
  //       .filter((entry) => entry.isIntersecting)
  //       .map((entry) => entry.target.getAttribute('data-track'));

  //     console.log("newVisibleTracks in useEffect: ", newVisibleTracks, ", #: ", newVisibleTracks.length);

  //     setVisibleTracks(newVisibleTracks);
  //   });

  //   if (tracksContainerRef.current) {
  //     const trackElements = tracksContainerRef.current.querySelectorAll('.trackItem');
  //     trackElements.forEach((element, index) => {
  //       const track = listTracks[index]; // Make sure this matches the index of the element
  //       element.setAttribute('data-track', track);
  //       observer.observe(element);
  //     });
  //   }

  //   console.log("---- observer in useEffect: ", observer);
  //   console.log("---- visibleTracks: ",visibleTracks,", #: ",visibleTracks.length);
  //   return () => {
  //     if (tracksContainerRef.current) {
  //       const trackElements = tracksContainerRef.current.querySelectorAll('.trackItem');
  //       trackElements.forEach((element) => {
  //         observer.unobserve(element);
  //       });
  //     }
  //   };
  // }, [listTracks]);

  useEffect(() => {
    const containerElement = tracksContainerRef.current;
    // const trackElements = containerElement.querySelectorAll('.trackItem');
    const trackElementsDocument =
      Array.from(document.getElementsByClassName('trackItem'))
        .filter((a, ndx) => ndx < 10); // For test. Will need to change it to another way based on... scrolling of view.

    const observer = new IntersectionObserver((entries) => {      
      console.log("entries: ", entries, ", #: ",entries.length); // Check the logged entries in the browser's console
      entries.map(a => console.log(a.target));
      console.log("containerElement: ", containerElement);
      // console.log("trackElements: ",trackElements);
      // console.log("trackElementsDocument: ",trackElementsDocument);
      // trackElementsDocument.forEach((a)=>{ console.log('element of trackElementsDocument. a: ',a); })
      // console.log('trackElements[0]: ', trackElements[0], ", trackElements.length: ", trackElements.length);
      console.log('trackElementsDocument[0]: ', trackElementsDocument[0], ", trackElementsDocument.length: ", trackElementsDocument.length);

      const newVisibleTracks = entries.map((entry) => ({
        track: entry.target.getAttribute('data-track'),
        isVisible: entry.isIntersecting,
      }));

      setVisibleTracks(newVisibleTracks);
    });
  
  
    // trackElements.forEach((element) => {
    //   observer.observe(element);
    // });
    trackElementsDocument.forEach((element) => {
      observer.observe(element);
    });

  
    // Clean up the observer when the component is unmounted
    return () => {
      // trackElements.forEach((element) => {
      //   observer.unobserve(element);
      // });
      trackElementsDocument.forEach((element) => {
        observer.unobserve(element);
      });

    };
  }, []);
   
  

  return (
    testPerformances ? <></> :
      <>
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
              <div className='matchedTracksOfRecording' ref={tracksContainerRef}>
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
      </>
  );
}

export default ResultsComponent;
