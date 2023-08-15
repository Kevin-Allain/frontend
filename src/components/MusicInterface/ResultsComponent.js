import React from 'react';
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
  return (
    testPerformances?<></>:
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
            <em>
              List of recordings{' '}
              <MdKeyboardDoubleArrowUp
                className='icon'
                onClick={scrollToButtonListLogsNumbers}
              />
            </em>
            <div className='metadataRecording'>
              {infoMusicList.length === 0 ? (
                <AiOutlineLoading className='spin' size={'20px'} />
              ) : findMatchRecording(lln) !== -1 ? (
                <div>
                  {/* Content to display if the index matches */}
                  <p>lognumber: {lln}</p>
                  {/* Add more properties from the matched object here */}
                  {/* From item: {infoMusicList[findMatchRecording(lln)].lognumber} */}
                  From item: 
                  {Object.entries(infoMusicList[findMatchRecording(lln)]).map(([key, value]) => (
                    <p key={key}>
                      {key}: {value}
                    </p>
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
                      <div className='trackItem' id={track} key={track}>
                        Previous Recording{' '}
                        <MdKeyboardDoubleArrowLeft
                          className='icon'
                          onClick={(e) =>
                            scrollToButtonListRecordingsFollowing(
                              e,
                              lln,
                              'prev'
                            )
                          }
                        />
                        | Previous Track{' '}
                        <MdOutlineKeyboardArrowLeft
                          className='icon'
                          onClick={(e) => scrollToButtonListTracksFollowing( e, ndx, track, 'prev' ) }
                        />
                        | Next Track{' '}
                        <MdOutlineKeyboardArrowRight
                          className='icon'
                          onClick={(e) =>
                            scrollToButtonListTracksFollowing( e, ndx, track, 'next' )
                          }
                        />
                        | Next Recording
                        <MdKeyboardDoubleArrowRight
                          className='icon'
                          onClick={(e) =>
                            scrollToButtonListRecordingsFollowing( e, lln, 'next' )
                          }
                        />
                        {/* <TrackRes
                          key={'Track' + ndx + '' + track}
                          text={track}
                          listSearchRes={listSearchRes.filter(
                            (a) => a.recording === track
                          )}
                          formatAndPlay={formatAndPlay}
                          getMusicInfo={getMusicInfo}
                          infoMusicList={infoMusicList}
                          setInfoMusicList={setInfoMusicList}
                        /> */}
                      </div>
                    );
                  } else {
                    return null; // or any fallback if track doesn't match
                  }
                })}
            </div>
          </div>
        ))}
    </>
  );
};

export default ResultsComponent;
